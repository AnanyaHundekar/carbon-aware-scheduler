from scheduler.decision_engine import schedule_task


# ---------------------------------------------------------
# RUN ONE SCENARIO
# ---------------------------------------------------------

def run_scenario(task, options, priorities):

    decision = schedule_task(
        task,
        options,
        priorities
    )

    return decision


# ---------------------------------------------------------
# DEFINE AND RUN ALL SCENARIOS
# ---------------------------------------------------------

def compare_scenarios(task, options):

    scenarios = {

        "Balanced": {
            "latency": 0.20,
            "accuracy": 0.30,
            "cost": 0.20,
            "energy": 0.10,
            "carbon": 0.20
        },

        "Low Carbon": {
            "latency": 0.10,
            "accuracy": 0.20,
            "cost": 0.10,
            "energy": 0.20,
            "carbon": 0.40
        },

        "Low Latency": {
            "latency": 0.50,
            "accuracy": 0.20,
            "cost": 0.10,
            "energy": 0.05,
            "carbon": 0.15
        }
    }

    results = {}

    for name, priorities in scenarios.items():

        results[name] = run_scenario(
            task,
            options,
            priorities
        )

    return results, scenarios


# ---------------------------------------------------------
# CALCULATE PERCENTAGE CHANGE
# ---------------------------------------------------------

def percentage_change(old, new):

    if old == 0:
        return 0

    return ((new - old) / old) * 100


# ---------------------------------------------------------
# COMPARE TWO DECISIONS
# ---------------------------------------------------------

def compare_decisions(results, first, second):

    old = results[first]
    new = results[second]

    comparison = {

        "from": first,
        "to": second,

        "model_change": (
            f"{old['model']} → {new['model']}"
        ),

        "time_change": (
            f"{old['time']} → {new['time']}"
        ),

        "latency_change": percentage_change(
            old["latency"],
            new["latency"]
        ),

        "carbon_change": percentage_change(
            old["carbon"],
            new["carbon"]
        ),

        "cost_change": percentage_change(
            old["cost"],
            new["cost"]
        ),

        "accuracy_change": percentage_change(
            old["accuracy"],
            new["accuracy"]
        ),

        "energy_change": percentage_change(
            old["energy"],
            new["energy"]
        )
    }

    print(
        f"\n===== {first} → {second} ====="
    )

    if old["model"] != new["model"]:
        print(
            f"Model: {old['model']} → {new['model']}"
        )

    if old["time"] != new["time"]:
        print(
            f"Time: {old['time']} → {new['time']}"
        )

    print(
        f"Latency: {old['latency']} → "
        f"{new['latency']} "
        f"({comparison['latency_change']:+.1f}%)"
    )

    print(
        f"Carbon: {old['carbon']} → "
        f"{new['carbon']} "
        f"({comparison['carbon_change']:+.1f}%)"
    )

    print(
        f"Cost: {old['cost']} → "
        f"{new['cost']} "
        f"({comparison['cost_change']:+.1f}%)"
    )

    print(
        f"Accuracy: {old['accuracy']} → "
        f"{new['accuracy']} "
        f"({comparison['accuracy_change']:+.1f}%)"
    )

    print(
        f"Energy: {old['energy']} → "
        f"{new['energy']} "
        f"({comparison['energy_change']:+.1f}%)"
    )

    return comparison


# ---------------------------------------------------------
# FIND PRIORITY CHANGES
# ---------------------------------------------------------

def get_priority_changes(
    scenarios,
    first,
    second
):

    old = scenarios[first]
    new = scenarios[second]

    changes = {}

    for metric in old:

        if old[metric] != new[metric]:

            changes[metric] = {
                "from": old[metric],
                "to": new[metric]
            }

    return changes


# ---------------------------------------------------------
# EXPLAIN WHY THE DECISION CHANGED
# ---------------------------------------------------------

def explain_decision_change(
    results,
    scenarios,
    first,
    second
):

    old = results[first]
    new = results[second]

    priority_changes = get_priority_changes(
        scenarios,
        first,
        second
    )

    print(
        "\n===== WHY DID THE DECISION CHANGE? ====="
    )

    print("\nPriority changes:")

    for metric, values in priority_changes.items():

        print(
            f"{metric.capitalize()}: "
            f"{values['from'] * 100:.0f}% → "
            f"{values['to'] * 100:.0f}%"
        )

    # Find the largest increased priority

    largest_priority = None
    largest_difference = 0

    for metric, values in priority_changes.items():

        difference = (
            values["to"] - values["from"]
        )

        if difference > largest_difference:

            largest_difference = difference
            largest_priority = metric

    if largest_priority:

        print(
            f"\nBecause {largest_priority} became "
            f"a higher priority, the scheduler "
            f"changed the decision."
        )

    else:

        print(
            "\nThe scheduler changed the decision "
            "because the overall priority balance changed."
        )

    if old["model"] != new["model"]:

        print(
            f"Model: {old['model']} → {new['model']}"
        )

    if old["time"] != new["time"]:

        print(
            f"Time: {old['time']} → {new['time']}"
        )

    print("\nResulting trade-offs:")

    latency_change = percentage_change(
        old["latency"],
        new["latency"]
    )

    carbon_change = percentage_change(
        old["carbon"],
        new["carbon"]
    )

    cost_change = percentage_change(
        old["cost"],
        new["cost"]
    )

    energy_change = percentage_change(
        old["energy"],
        new["energy"]
    )

    accuracy_change = percentage_change(
        old["accuracy"],
        new["accuracy"]
    )

    print(
        f"Latency: {old['latency']}s → "
        f"{new['latency']}s "
        f"({latency_change:+.1f}%)"
    )

    print(
        f"Carbon: {old['carbon']} → "
        f"{new['carbon']} "
        f"({carbon_change:+.1f}%)"
    )

    print(
        f"Cost: {old['cost']} → "
        f"{new['cost']} "
        f"({cost_change:+.1f}%)"
    )

    print(
        f"Energy: {old['energy']} → "
        f"{new['energy']} "
        f"({energy_change:+.1f}%)"
    )

    print(
        f"Accuracy: {old['accuracy']} → "
        f"{new['accuracy']} "
        f"({accuracy_change:+.1f}%)"
    )

    # Final human-readable trade-off

    print("\nSummary:")

    if latency_change < 0 and carbon_change > 0:

        print(
            "The scheduler reduced latency at the "
            "expense of higher carbon emissions."
        )

    elif carbon_change < 0 and latency_change > 0:

        print(
            "The scheduler reduced carbon emissions "
            "while accepting higher latency."
        )

    elif cost_change < 0 and latency_change <= 0:

        print(
            "The scheduler reduced cost while "
            "maintaining or improving latency."
        )

    else:

        print(
            "The scheduler changed the execution plan "
            "to reflect the new optimization priorities."
        )

    return {
        "from": first,
        "to": second,
        "priority_changes": priority_changes,
        "reason": (
            f"{largest_priority} became a higher priority."
            if largest_priority
            else "Overall priority balance changed."
        ),
        "tradeoffs": {
            "latency": latency_change,
            "carbon": carbon_change,
            "cost": cost_change,
            "energy": energy_change,
            "accuracy": accuracy_change
        }
    }


# ---------------------------------------------------------
# DISPLAY ALL SCENARIO RESULTS
# ---------------------------------------------------------

def display_scenarios(results):

    print("\n===== SCENARIO COMPARISON =====")

    for name, result in results.items():

        print(f"\n{name}")

        print("Model:", result["model"])
        print("Location:", result["location"])
        print("Time:", result["time"])
        print("Accuracy:", result["accuracy"])
        print("Latency:", result["latency"])
        print("Cost:", result["cost"])
        print("Energy:", result["energy"])
        print("Carbon:", result["carbon"])

        print("Reason:", result["reason"])


# ---------------------------------------------------------
# MAIN TEST
# ---------------------------------------------------------

if __name__ == "__main__":

    task = {

        "task": "Analyze customer complaints",

        "complexity": "medium",

        "accuracy_requirement": 0.90,

        "max_latency": 5,

        "urgency": "normal",

        "can_defer": True
    }


    options = [

        {
            "model": "Small",
            "location": "India",
            "time": "Now",
            "accuracy": 0.91,
            "latency": 1.0,
            "cost": 0.01,
            "energy": 3.0,
            "carbon": 2.4
        },

        {
            "model": "Medium",
            "location": "India",
            "time": "+30 min",
            "accuracy": 0.95,
            "latency": 2.0,
            "cost": 0.03,
            "energy": 6.0,
            "carbon": 1.5
        },

        {
            "model": "Large",
            "location": "India",
            "time": "Now",
            "accuracy": 0.99,
            "latency": 4.0,
            "cost": 0.08,
            "energy": 15.0,
            "carbon": 3.0
        }
    ]


    # Run scenarios

    results, scenarios = compare_scenarios(
        task,
        options
    )


    # Display results

    display_scenarios(results)


    # Compare Balanced vs Low Latency

    comparison = compare_decisions(
        results,
        "Balanced",
        "Low Latency"
    )


    # Explain decision change

    explanation = explain_decision_change(
        results,
        scenarios,
        "Balanced",
        "Low Latency"
    )


    # Structured result for future frontend/API use

    final_result = {

        "scenarios": results,

        "comparison": comparison,

        "explanation": explanation
    }


    print("\n===== STRUCTURED RESULT =====")

    print(
        "Scenario engine completed successfully."
    )

