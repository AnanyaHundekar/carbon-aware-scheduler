from scheduler.decision_engine import schedule_task
from simulator.simulator import get_available_options
from agents.workflow_agent import analyze_workflow


# ---------------------------------------------------------
# Detect environment changes
# ---------------------------------------------------------

def detect_change(current_conditions, new_conditions):

    changes = []

    keys = [
        "latency_multiplier",
        "carbon_multiplier",
        "unavailable_models"
    ]

    for key in keys:

        old_value = current_conditions.get(key)
        new_value = new_conditions.get(key)

        if old_value != new_value:

            changes.append({
                "parameter": key,
                "old": old_value,
                "new": new_value
            })

    return {
        "replan_required": len(changes) > 0,
        "changes": changes
    }


# ---------------------------------------------------------
# Apply environment changes to available options
# ---------------------------------------------------------

def apply_environment_changes(options, conditions):

    unavailable_models = conditions.get(
        "unavailable_models",
        []
    )

    filtered_options = []

    for option in options:

        model = option.get("model")

        if model not in unavailable_models:
            filtered_options.append(option.copy())

    return filtered_options


# ---------------------------------------------------------
# Apply environmental impact
# ---------------------------------------------------------

def apply_environment_impact(decision, conditions):

    updated = decision.copy()

    latency_multiplier = conditions.get(
        "latency_multiplier",
        1.0
    )

    carbon_multiplier = conditions.get(
        "carbon_multiplier",
        1.0
    )

    # Apply latency impact once
    if "latency" in updated:
        updated["latency"] = round(
            updated["latency"] * latency_multiplier,
            4
        )

    # Apply carbon impact once
    if "carbon" in updated:
        updated["carbon"] = round(
            updated["carbon"] * carbon_multiplier,
            4
        )

    return updated


# ---------------------------------------------------------
# Get value from decision using multiple possible names
# ---------------------------------------------------------

def get_value(decision, names):

    for name in names:

        if name in decision:
            return decision[name]

    return None


# ---------------------------------------------------------
# Get selected time
# ---------------------------------------------------------

def get_time(decision):

    return get_value(
        decision,
        [
            "time",
            "start_time",
            "start_delay"
        ]
    )


# ---------------------------------------------------------
# Format selected time
# ---------------------------------------------------------

def format_time(decision):

    time_value = get_time(decision)

    if time_value is None:
        return "Unknown"

    if isinstance(time_value, (int, float)):

        if time_value == 0:
            return "Now"

        return f"+{time_value} min"

    return str(time_value)


# ---------------------------------------------------------
# Compare old and new decisions
# ---------------------------------------------------------

def compare_decisions(old_decision, new_decision):

    changes = {}

    metrics = [
        "latency",
        "cost",
        "energy",
        "carbon"
    ]

    for metric in metrics:

        old_value = get_value(
            old_decision,
            [metric]
        )

        new_value = get_value(
            new_decision,
            [metric]
        )

        if (
            old_value is None
            or new_value is None
        ):
            continue

        if old_value == 0:

            percentage = 0

        else:

            percentage = (
                (new_value - old_value)
                / old_value
            ) * 100

        changes[metric] = {
            "old": round(old_value, 4),
            "new": round(new_value, 4),
            "percentage_change": round(
                percentage,
                2
            )
        }

    return changes


# ---------------------------------------------------------
# Explain why replanning happened
# ---------------------------------------------------------

def explain_replanning(
    changes,
    old_decision,
    new_decision
):

    reasons = []

    unavailable = changes.get(
        "unavailable_models"
    )

    if unavailable:

        new_models = unavailable.get(
            "new",
            []
        )

        old_models = unavailable.get(
            "old",
            []
        )

        newly_unavailable = [
            model
            for model in new_models
            if model not in old_models
        ]

        if newly_unavailable:

            reasons.append(
                "The following model(s) became unavailable: "
                + ", ".join(newly_unavailable)
                + "."
            )

    if changes.get("carbon_multiplier"):

        carbon_change = changes[
            "carbon_multiplier"
        ]

        if (
            carbon_change["old"]
            != carbon_change["new"]
        ):

            reasons.append(
                "Carbon conditions changed."
            )

    if changes.get("latency_multiplier"):

        latency_change = changes[
            "latency_multiplier"
        ]

        if (
            latency_change["old"]
            != latency_change["new"]
        ):

            reasons.append(
                "Latency conditions changed."
            )

    old_model = old_decision.get(
        "model",
        "Unknown"
    )

    new_model = new_decision.get(
        "model",
        "Unknown"
    )

    if old_model != new_model:

        reasons.append(
            f"The scheduler switched from "
            f"{old_model} to {new_model}."
        )

    if not reasons:

        reasons.append(
            "The environment changed, "
            "but the scheduler kept the same decision."
        )

    return " ".join(reasons)


# ---------------------------------------------------------
# Replan one task
# ---------------------------------------------------------

def replan_task(
    task,
    options,
    priorities,
    current_conditions,
    new_conditions
):

    # Initial decision
    initial_options = apply_environment_changes(
        options,
        current_conditions
    )

    initial_decision = schedule_task(
        task,
        initial_options,
        priorities
    )

    initial_decision = apply_environment_impact(
        initial_decision,
        current_conditions
    )

    # New environment
    new_options = apply_environment_changes(
        options,
        new_conditions
    )

    # If no models are available
    if not new_options:

        return {
            "task": task,
            "status": "failed",
            "message": "No available models after environment changes.",
            "initial_decision": initial_decision,
            "replanned_decision": None
        }

    # Replan
    replanned_decision = schedule_task(
        task,
        new_options,
        priorities
    )

    replanned_decision = apply_environment_impact(
        replanned_decision,
        new_conditions
    )

    # Compare
    impact = compare_decisions(
        initial_decision,
        replanned_decision
    )

    changes = {}

    detection = detect_change(
        current_conditions,
        new_conditions
    )

    for change in detection["changes"]:

        changes[
            change["parameter"]
        ] = {
            "old": change["old"],
            "new": change["new"]
        }

    explanation = explain_replanning(
        changes,
        initial_decision,
        replanned_decision
    )

    return {
        "task": task,
        "status": "replanned",
        "initial_decision": initial_decision,
        "replanned_decision": replanned_decision,
        "impact": impact,
        "explanation": explanation,
        "environment_changes": changes
    }


# ---------------------------------------------------------
# Automatic replanning
# ---------------------------------------------------------

def run_automatic_replanning(
    tasks,
    priorities,
    current_conditions,
    new_conditions
):

    results = []

    detection = detect_change(
        current_conditions,
        new_conditions
    )

    if not detection["replan_required"]:

        return {
            "replan_required": False,
            "results": []
        }

    for task in tasks:

        scheduler_task = task.copy()

        scheduler_task["task"] = task.get(
            "task",
            task.get(
                "description",
                "Process task"
            )
        )

        options = get_available_options(
            scheduler_task
        )

        result = replan_task(
            scheduler_task,
            options,
            priorities,
            current_conditions,
            new_conditions
        )

        results.append(result)

    return {
        "replan_required": True,
        "results": results
    }


# ---------------------------------------------------------
# Display results
# ---------------------------------------------------------

def display_results(results):

    for result in results:

        task = result["task"]

        print("\n" + "=" * 60)
        print(
            f"TASK: {task.get('task', 'Unknown')}"
        )
        print("=" * 60)

        print(
            f"\nStatus: {result['status']}"
        )

        if result["status"] == "failed":

            print(
                result["message"]
            )
            continue

        initial = result[
            "initial_decision"
        ]

        replanned = result[
            "replanned_decision"
        ]

        print("\nINITIAL PLAN")
        print(
            f"Model: {initial.get('model')}"
        )
        print(
            f"Location: {initial.get('location')}"
        )
        print(
            f"Time: {format_time(initial)}"
        )
        print(
            f"Latency: {initial.get('latency')}"
        )
        print(
            f"Cost: {initial.get('cost')}"
        )
        print(
            f"Energy: {initial.get('energy')}"
        )
        print(
            f"Carbon: {initial.get('carbon')}"
        )

        print("\nREPLANNED PLAN")
        print(
            f"Model: {replanned.get('model')}"
        )
        print(
            f"Location: {replanned.get('location')}"
        )
        print(
            f"Time: {format_time(replanned)}"
        )
        print(
            f"Latency: {replanned.get('latency')}"
        )
        print(
            f"Cost: {replanned.get('cost')}"
        )
        print(
            f"Energy: {replanned.get('energy')}"
        )
        print(
            f"Carbon: {replanned.get('carbon')}"
        )

        print("\nIMPACT")

        for metric, values in result[
            "impact"
        ].items():

            percentage = values[
                "percentage_change"
            ]

            sign = "+" if percentage >= 0 else ""

            print(
                f"{metric}: "
                f"{values['old']} -> "
                f"{values['new']} "
                f"({sign}{percentage}%)"
            )

        print("\nWHY DID IT REPLAN?")
        print(
            result["explanation"]
        )


# ---------------------------------------------------------
# Real workflow replanning demo
# ---------------------------------------------------------

def run_real_replanning_demo(
    user_request
):

    from scheduler.config import (
        NORMAL_PRIORITIES
    )

    workflow = analyze_workflow(
        user_request
    )

    if workflow is None:

        return {
            "status": "error",
            "message": "Workflow analysis failed."
        }

    current_conditions = {
        "carbon_multiplier": 1.0,
        "latency_multiplier": 1.0,
        "unavailable_models": []
    }

    new_conditions = {
        "carbon_multiplier": 1.5,
        "latency_multiplier": 1.2,
        "unavailable_models": [
            "Medium"
        ]
    }

    result = run_automatic_replanning(
        workflow["tasks"],
        NORMAL_PRIORITIES,
        current_conditions,
        new_conditions
    )

    print("\n" + "=" * 60)
    print("ENVIRONMENT CHANGES")
    print("=" * 60)

    print(
        f"Carbon multiplier: "
        f"{current_conditions['carbon_multiplier']} "
        f"-> "
        f"{new_conditions['carbon_multiplier']}"
    )

    print(
        f"Latency multiplier: "
        f"{current_conditions['latency_multiplier']} "
        f"-> "
        f"{new_conditions['latency_multiplier']}"
    )

    print(
        f"Unavailable models: "
        f"{current_conditions['unavailable_models']} "
        f"-> "
        f"{new_conditions['unavailable_models']}"
    )

    display_results(
        result["results"]
    )

    print(
        "\nAUTOMATIC REPLANNING COMPLETE"
    )

    return {
        "status": "success",
        "workflow": workflow,
        "results": result
    }


# ---------------------------------------------------------
# Main
# ---------------------------------------------------------

if __name__ == "__main__":

    request = (
        "Analyze customer complaints, "
        "verify the results, and summarize "
        "the findings."
    )

    run_real_replanning_demo(
        request
    )