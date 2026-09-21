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