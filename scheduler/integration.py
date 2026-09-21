from simulator.simulator import get_available_options
from scheduler.decision_engine import schedule_task
from agents.workflow_agent import analyze_workflow


def schedule_task_with_simulator(task, priorities):
    """
    Get execution options from Person 3's simulator
    and select the best option using Person 2's scheduler.
    """

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


def schedule_workflow_tasks(tasks, options_by_task, priorities):
    """
    Schedule all workflow tasks using the simulator
    and scheduler.
    """

    results = []

    for task in tasks:

        task_name = task.get(
            "task",
            task.get("description")
        )

        scheduler_task = task.copy()

        # Gemini → Scheduler mapping
        scheduler_task["task"] = task_name

        if "accuracy_required" in task:
            scheduler_task["accuracy_requirement"] = task["accuracy_required"]

        if "urgent" in task:
            scheduler_task["urgency"] = (
                "high" if task["urgent"] else "normal"
            )

        # Use provided options if available
        if options_by_task and task_name in options_by_task:
            options = options_by_task[task_name]
        else:
            # Generate options using simulator
            options = get_available_options(scheduler_task)

        decision = schedule_task(
            scheduler_task,
            options,
            priorities
        )

        results.append(decision)

    return results


def run_full_workflow(user_request, priorities):
    """
    Complete pipeline:

    User request
        ↓
    Gemini Workflow Analyzer
        ↓
    Task decomposition
        ↓
    Simulator options
        ↓
    Scheduler decision
    """

    workflow = analyze_workflow(user_request)

    if workflow is None:
        return {
            "status": "error",
            "message": "Workflow analysis failed."
        }

    tasks = workflow["tasks"]

    results = schedule_workflow_tasks(
        tasks,
        {},
        priorities
    )

    return {
        "status": "success",
        "workflow": workflow,
        "schedule": results
    }