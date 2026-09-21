# scheduler/baseline.py


def calculate_savings(baseline, scheduled):
    """
    Compare baseline execution with
    scheduler-selected execution.
    """

    if (
        baseline["status"] != "success"
        or scheduled["status"] != "success"
    ):
        return {
            "status": "comparison_failed",
            "reason": "Both baseline and scheduler decisions must succeed."
        }

    metrics = [
        "latency",
        "cost",
        "energy",
        "carbon"
    ]

    savings = {}

    for metric in metrics:
        baseline_value = baseline[metric]
        scheduled_value = scheduled[metric]

        absolute_saving = (
            baseline_value - scheduled_value
        )

        if baseline_value != 0:
            percentage_saving = (
                absolute_saving / baseline_value
            ) * 100
        else:
            percentage_saving = 0

        savings[metric] = {
            "baseline": baseline_value,
            "scheduled": scheduled_value,
            "absolute_saving": round(
                absolute_saving, 4
            ),
            "percentage_saving": round(
                percentage_saving, 2
            )
        }

    return {
        "status": "success",
        "baseline_model": baseline["model"],
        "scheduled_model": scheduled["model"],
        "savings": savings
    }