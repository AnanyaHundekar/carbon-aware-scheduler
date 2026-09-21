# scheduler/workflow_scheduler.py

from scheduler.decision_engine import schedule_task


def schedule_workflow(tasks, options_by_task, priorities, carbon_budget):
    """
    Schedule all tasks while respecting
    a global workflow carbon budget.
    """

    results = []

    remaining_budget = carbon_budget
    total_carbon = 0

    for task in tasks:

        task_name = task.get("task")

        # Get available options for this task
        options = options_by_task.get(task_name, [])

        # Apply remaining workflow carbon budget
        task = task.copy()
        task["carbon_budget"] = remaining_budget

        # Schedule this task
        decision = schedule_task(
            task,
            options,
            priorities
        )

        results.append(decision)

        # If task could not be scheduled,
        # stop the workflow
        if decision["status"] != "success":
            return {
                "status": "workflow_failed",
                "reason": f"Could not schedule task: {task_name}",
                "results": results,
                "total_carbon": total_carbon,
                "remaining_carbon_budget": remaining_budget
            }

        # Update carbon usage
        selected_carbon = decision["carbon"]

        total_carbon += selected_carbon
        remaining_budget -= selected_carbon

    return {
        "status": "success",
        "results": results,
        "total_carbon": total_carbon,
        "carbon_budget": carbon_budget,
        "remaining_carbon_budget": remaining_budget
    }