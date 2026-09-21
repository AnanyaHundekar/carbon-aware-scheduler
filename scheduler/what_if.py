# scheduler/what_if.py

from scheduler.decision_engine import schedule_task


def compare_priorities(
    task,
    options,
    current_priorities,
    alternative_priorities
):
    """
    Compare scheduling decisions under
    two different priority configurations.
    """

    current_decision = schedule_task(
        task,
        options,
        current_priorities
    )

    alternative_decision = schedule_task(
        task,
        options,
        alternative_priorities
    )

    result = {
        "current": current_decision,
        "alternative": alternative_decision
    }

    # If either decision failed, return the results
    if (
        current_decision["status"] != "success"
        or alternative_decision["status"] != "success"
    ):
        result["comparison_status"] = "decision_failed"
        return result

    # Calculate changes
    changes = {
        "model_changed": (
            current_decision["model"]
            != alternative_decision["model"]
        ),

        "location_changed": (
            current_decision["location"]
            != alternative_decision["location"]
        ),

        "time_changed": (
            current_decision["time"]
            != alternative_decision["time"]
        ),

        "latency_change": round(
            alternative_decision["latency"]
            - current_decision["latency"],
            2
        ),

        "cost_change": round(
            alternative_decision["cost"]
            - current_decision["cost"],
            4
        ),

        "energy_change": round(
            alternative_decision["energy"]
            - current_decision["energy"],
            2
        ),

        "carbon_change": round(
            alternative_decision["carbon"]
            - current_decision["carbon"],
            2
        ),

        "accuracy_change": round(
            alternative_decision["accuracy"]
            - current_decision["accuracy"],
            4
        )
    }

    # Determine whether the actual decision changed
    decision_changed = (
        changes["model_changed"]
        or changes["location_changed"]
        or changes["time_changed"]
    )

    changes["decision_changed"] = decision_changed

    result["changes"] = changes

    # Human-readable summary
    if decision_changed:
        result["summary"] = (
            f"Changing priorities switched the decision "
            f"from {current_decision['model']} "
            f"to {alternative_decision['model']}."
        )
    else:
        result["summary"] = (
            f"Changing priorities did not change the selected "
            f"option. Both configurations selected "
            f"{current_decision['model']}."
        )

    return result