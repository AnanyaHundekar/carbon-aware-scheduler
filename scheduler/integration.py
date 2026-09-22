from simulator.simulator import get_available_options
from scheduler.decision_engine import schedule_task
from agents.workflow_agent import analyze_workflow


# ---------------------------------------------------------
# Schedule one task using simulator options
# ---------------------------------------------------------

def schedule_task_with_simulator(task, priorities):

    options = get_available_options(task)

    if "task" not in task and "description" in task:

        task = task.copy()
        task["task"] = task["description"]

    decision = schedule_task(
        task,
        options,
        priorities
    )

    return decision


# ---------------------------------------------------------
# Schedule all workflow tasks
# ---------------------------------------------------------

def schedule_workflow_tasks(
    tasks,
    options_by_task=None,
    priorities=None
):

    # Backward compatibility:
    # If only two arguments are supplied,
    # treat the second argument as priorities.

    if priorities is None:

        priorities = options_by_task
        options_by_task = {}

    results = []

    for task in tasks:

        task_name = task.get(
            "task",
            task.get(
                "description",
                "Process task"
            )
        )

        scheduler_task = task.copy()

        scheduler_task["task"] = task_name

        # Support old field names
        if "accuracy_required" in task:

            scheduler_task[
                "accuracy_requirement"
            ] = task[
                "accuracy_required"
            ]

        if "urgent" in task:

            scheduler_task[
                "urgency"
            ] = (
                "high"
                if task["urgent"]
                else "normal"
            )

        # Use supplied options if available
        if (
            options_by_task
            and task_name in options_by_task
        ):

            options = options_by_task[
                task_name
            ]

        else:

            options = get_available_options(
                scheduler_task
            )

        decision = schedule_task(
            scheduler_task,
            options,
            priorities
        )

        results.append(decision)

    return results


# ---------------------------------------------------------
# Complete workflow
# ---------------------------------------------------------

def run_full_workflow(
    user_request,
    priorities
):

    # Step 1:
    # Analyze the natural-language request

    workflow = analyze_workflow(
        user_request
    )

    if workflow is None:

        return {
            "status": "error",
            "message": "Workflow analysis failed."
        }

    # Step 2:
    # Extract tasks

    tasks = workflow.get(
        "tasks",
        []
    )

    if not tasks:

        return {
            "status": "error",
            "message": "No workflow tasks were generated."
        }

    # Step 3:
    # Schedule every task

    results = schedule_workflow_tasks(
        tasks,
        {},
        priorities
    )

    # Step 4:
    # Return complete result

    return {
        "status": "success",
        "workflow": workflow,
        "schedule": results
    }


# ---------------------------------------------------------
# Simple manual test
# ---------------------------------------------------------

if __name__ == "__main__":

    from scheduler.config import (
        NORMAL_PRIORITIES
    )

    request = (
        "Analyze customer complaints, "
        "verify the results, and summarize "
        "the findings."
    )

    result = run_full_workflow(
        request,
        NORMAL_PRIORITIES
    )

    import json

    print(
        json.dumps(
            result,
            indent=4
        )
    )