# scheduler/decision_engine.py

from scheduler.constraints import (
    filter_valid_options,
    explain_constraint_failures
)

from scheduler.scoring import (
    calculate_scores,
    select_best_option
)


def schedule_task(task, options, priorities):
    """
    Select the best execution option for a task.
    """

    # 1. Apply hard constraints
    valid_options = filter_valid_options(
        task,
        options
    )

    # No feasible option
    if not valid_options:

        failures = explain_constraint_failures(
            task,
            options
        )

        return {
            "status": "no_feasible_option",
            "task": task.get("task"),
            "reason": "No available execution option satisfies all constraints.",
            "constraint_failures": failures
        }

    # 2. Calculate scores
    scored_options = calculate_scores(
        valid_options,
        priorities
    )

    # 3. Select best option
    best_option = select_best_option(
        scored_options
    )

    # 4. Generate explanation
    reason = generate_reason(
        task,
        best_option,
        priorities
    )

    # 5. Return decision
    return {
        "status": "success",
        "task": task.get("task"),
        "model": best_option["model"],
        "location": best_option["location"],
        "time": best_option["time"],
        "accuracy": best_option["accuracy"],
        "latency": best_option["latency"],
        "cost": best_option["cost"],
        "energy": best_option["energy"],
        "carbon": best_option["carbon"],
        "score": round(best_option["score"], 4),
        "score_breakdown": best_option["score_breakdown"],
        "reason": reason
    }


def generate_reason(task, option, priorities):
    """
    Generate a human-readable explanation
    for the scheduling decision.
    """

    reasons = []

    # Accuracy
    required_accuracy = task.get(
        "accuracy_requirement"
    )

    if required_accuracy is not None:
        reasons.append(
            f"Accuracy {option['accuracy']:.0%} "
            f"meets the required {required_accuracy:.0%}"
        )

    # Highest-priority factor
    if priorities:

        highest_priority = max(
            priorities,
            key=priorities.get
        )

        if highest_priority == "latency":
            reasons.append(
                f"low latency ({option['latency']} sec)"
            )

        elif highest_priority == "carbon":
            reasons.append(
                f"low carbon ({option['carbon']})"
            )

        elif highest_priority == "energy":
            reasons.append(
                f"low energy usage ({option['energy']})"
            )

        elif highest_priority == "cost":
            reasons.append(
                f"low cost ({option['cost']})"
            )

        elif highest_priority == "accuracy":
            reasons.append(
                f"high accuracy ({option['accuracy']:.0%})"
            )

    return (
        f"{option['model']} model selected because "
        + " and ".join(reasons)
        + f". Overall score: {option['score']:.4f}."
    )