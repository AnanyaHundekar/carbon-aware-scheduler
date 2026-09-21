from simulator.simulator import get_available_options
from scheduler.decision_engine import schedule_task


def schedule_task_with_simulator(task, priorities):
    """
    Get execution options from Person 3's simulator
    and select the best option using Person 2's scheduler.
    """

    options = get_available_options(task)

    decision = schedule_task(
        task,
        options,
        priorities
    )

    return decision


def schedule_workflow_tasks(tasks, options_by_task, priorities):
    """
    Schedule all workflow tasks from Person 1
    using Person 3's options and Person 2's scheduler.
    """

    results = []

    for task in tasks:
        task_name = task["task"]

        options = options_by_task[task_name]

        decision = schedule_task(
            task,
            options,
            priorities
        )

        results.append(decision)

    return results