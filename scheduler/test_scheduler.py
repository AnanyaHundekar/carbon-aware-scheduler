from scheduler.decision_engine import schedule_task
from scheduler.config import (
    NORMAL_PRIORITIES,
    FINISH_ASAP_PRIORITIES,
    ECO_PRIORITIES
)


options = [
    {
        "model": "Small",
        "location": "India",
        "time": "Now",
        "start_delay": 0,
        "latency": 1.0,
        "latency_minutes": 1,
        "accuracy": 0.80,
        "cost": 0.01,
        "energy": 3.0,
        "carbon": 2.0
    },
    {
        "model": "Medium",
        "location": "India",
        "time": "+15 min",
        "start_delay": 15,
        "latency": 2.0,
        "latency_minutes": 2,
        "accuracy": 0.94,
        "cost": 0.03,
        "energy": 6.0,
        "carbon": 1.5
    },
    {
        "model": "Large",
        "location": "US",
        "time": "Now",
        "start_delay": 0,
        "latency": 4.0,
        "latency_minutes": 4,
        "accuracy": 0.98,
        "cost": 0.10,
        "energy": 15.0,
        "carbon": 5.0
    }
]

# --------------------------------------------------
# TEST 1: High Accuracy Requirement
# --------------------------------------------------

print("\n===== TEST 1: HIGH ACCURACY =====")

task1 = {
    "task": "Analyze customer complaints",
    "accuracy_requirement": 0.95
}

decision1 = schedule_task(
    task1,
    options,
    NORMAL_PRIORITIES
)

print(decision1)


# --------------------------------------------------
# TEST 2: Finish ASAP
# --------------------------------------------------

print("\n===== TEST 2: FINISH ASAP =====")

task2 = {
    "task": "Quick customer analysis",
    "accuracy_requirement": 0.80
}

decision2 = schedule_task(
    task2,
    options,
    FINISH_ASAP_PRIORITIES
)

print(decision2)


# --------------------------------------------------
# TEST 3: Eco Mode
# --------------------------------------------------

print("\n===== TEST 3: ECO MODE =====")

task3 = {
    "task": "Process customer data",
    "accuracy_requirement": 0.80
}

decision3 = schedule_task(
    task3,
    options,
    ECO_PRIORITIES
)

print(decision3)


# --------------------------------------------------
# TEST 4: Impossible Task
# --------------------------------------------------

print("\n===== TEST 4: IMPOSSIBLE TASK =====")

task4 = {
    "task": "Extremely demanding analysis",
    "accuracy_requirement": 0.999,
    "max_latency": 1.0
}

decision4 = schedule_task(
    task4,
    options,
    NORMAL_PRIORITIES
)

print(decision4)
# --------------------------------------------------
# TEST 5: DEADLINE
# --------------------------------------------------

print("\n===== TEST 5: DEADLINE =====")

task5 = {
    "task": "Urgent customer analysis",
    "accuracy_requirement": 0.80,
    "deadline": 5
}

decision5 = schedule_task(
    task5,
    options,
    NORMAL_PRIORITIES
)

print(decision5)
# --------------------------------------------------
# TEST 6: CARBON BUDGET
# --------------------------------------------------

print("\n===== TEST 6: CARBON BUDGET =====")

task6 = {
    "task": "Eco-friendly customer analysis",
    "accuracy_requirement": 0.80,
    "carbon_budget": 1.6
}

decision6 = schedule_task(
    task6,
    options,
    ECO_PRIORITIES
)

print(decision6)

# --------------------------------------------------
# TEST 7: WORKFLOW CARBON BUDGET
# --------------------------------------------------

print("\n===== TEST 7: WORKFLOW CARBON BUDGET =====")

from scheduler.workflow_scheduler import schedule_workflow


workflow_tasks = [
    {
        "task": "Analyze customer complaints",
        "accuracy_requirement": 0.80
    },
    {
        "task": "Generate customer summary",
        "accuracy_requirement": 0.80
    }
]


workflow_options = {
    "Analyze customer complaints": options,
    "Generate customer summary": options
}


workflow_decision = schedule_workflow(
    workflow_tasks,
    workflow_options,
    ECO_PRIORITIES,
    carbon_budget=3.0
)

print(workflow_decision)
# --------------------------------------------------
# TEST 8: WORKFLOW BUDGET EXCEEDED
# --------------------------------------------------

print("\n===== TEST 8: WORKFLOW BUDGET EXCEEDED =====")

workflow_decision_2 = schedule_workflow(
    workflow_tasks,
    workflow_options,
    ECO_PRIORITIES,
    carbon_budget=2.0
)

print(workflow_decision_2)
# --------------------------------------------------
# TEST 9: WHAT-IF ANALYSIS
# --------------------------------------------------

print("\n===== TEST 9: WHAT-IF ANALYSIS =====")

from scheduler.what_if import compare_priorities


what_if_result = compare_priorities(
    task2,
    options,
    NORMAL_PRIORITIES,
    ECO_PRIORITIES
)

print(what_if_result)
# --------------------------------------------------
# TEST 10: WHAT-IF DECISION CHANGE
# --------------------------------------------------

print("\n===== TEST 10: WHAT-IF DECISION CHANGE =====")

from scheduler.what_if import compare_priorities

what_if_result_2 = compare_priorities(
    task2,
    options,
    NORMAL_PRIORITIES,
    FINISH_ASAP_PRIORITIES
)

print(what_if_result_2)
# --------------------------------------------------
# TEST 11: BASELINE VS SCHEDULER
# --------------------------------------------------

print("\n===== TEST 11: BASELINE VS SCHEDULER =====")

from scheduler.baseline import calculate_savings


# Fixed baseline: Large model
baseline_decision = {
    "status": "success",
    "model": "Large",
    "latency": 4.0,
    "cost": 0.10,
    "energy": 15.0,
    "carbon": 5.0
}


# Scheduler decision using Normal priorities
scheduled_decision = schedule_task(
    task2,
    options,
    NORMAL_PRIORITIES
)


baseline_result = calculate_savings(
    baseline_decision,
    scheduled_decision
)

print(baseline_result)
# --------------------------------------------------
# TEST 12: PARETO FRONT
# --------------------------------------------------

print("\n===== TEST 12: PARETO FRONT =====")

from scheduler.pareto import find_pareto_front


pareto_options = find_pareto_front(
    options
)

print("Pareto-optimal options:")

for option in pareto_options:
    print({
        "model": option["model"],
        "accuracy": option["accuracy"],
        "latency": option["latency"],
        "cost": option["cost"],
        "energy": option["energy"],
        "carbon": option["carbon"]
    })

print("\n===== TEST 13: CARBON FORECAST =====")

from simulator.carbon_forecast import (
    get_carbon_forecast,
    get_cleanest_time
)

forecast = get_carbon_forecast()

print("Carbon forecast:")

for option in forecast:
    print(option)

cleanest = get_cleanest_time()

print("\nCleanest execution time:")
print(cleanest)
print("\n===== TEST 14: TIME-DEPENDENT CARBON =====")

from simulator.carbon_forecast import get_carbon_forecast
from scheduler.carbon_calculator import apply_carbon_intensity

forecast = get_carbon_forecast()

test_options = [
    {
        "model": "Medium",
        "start_delay": 0,
        "energy": 6.0
    },
    {
        "model": "Medium",
        "start_delay": 15,
        "energy": 6.0
    },
    {
        "model": "Medium",
        "start_delay": 30,
        "energy": 6.0
    }
]

carbon_options = apply_carbon_intensity(
    test_options,
    forecast
)

for option in carbon_options:
    print(option)

print("\n===== TEST 15: CARBON-AWARE OPTION PREPARATION =====")

from scheduler.carbon_aware import prepare_carbon_aware_options

test_options = [
    {
        "model": "Small",
        "start_delay": 0,
        "energy": 3.0
    },
    {
        "model": "Medium",
        "start_delay": 15,
        "energy": 6.0
    },
    {
        "model": "Large",
        "start_delay": 30,
        "energy": 15.0
    }
]

prepared_options = prepare_carbon_aware_options(
    test_options
)

for option in prepared_options:
    print(option)

print("\n===== TEST 16: CARBON-AWARE SCORING =====")

from scheduler.scoring import calculate_scores
from scheduler.config import ECO_PRIORITIES

carbon_aware_options = [
    {
        "model": "Small",
        "start_delay": 0,
        "latency": 1.0,
        "accuracy": 0.80,
        "cost": 0.01,
        "energy": 3.0,
        "carbon": 2.0,
        "calculated_carbon": 2.4
    },
    {
        "model": "Medium",
        "start_delay": 15,
        "latency": 2.0,
        "accuracy": 0.94,
        "cost": 0.03,
        "energy": 6.0,
        "carbon": 1.5,
        "calculated_carbon": 2.4
    },
    {
        "model": "Large",
        "start_delay": 30,
        "latency": 4.0,
        "accuracy": 0.98,
        "cost": 0.10,
        "energy": 15.0,
        "carbon": 5.0,
        "calculated_carbon": 3.75
    }
]

scored = calculate_scores(
    carbon_aware_options,
    ECO_PRIORITIES
)

for option in scored:
    print({
        "model": option["model"],
        "start_delay": option["start_delay"],
        "calculated_carbon": option["calculated_carbon"],
        "score": round(option["score"], 4),
        "carbon_contribution": round(
            option["score_breakdown"]["carbon"],
            4
        )
    })

print("\n===== TEST 17: PERSON 3 SIMULATOR INTEGRATION =====")

from scheduler.integration import schedule_task_with_simulator
from scheduler.config import NORMAL_PRIORITIES

test_task = {
    "task": "Analyze customer complaints",
    "type": "analysis",
    "complexity": "high",
    "accuracy_requirement": 0.95,
    "urgency": "high"
}

decision = schedule_task_with_simulator(
    test_task,
    NORMAL_PRIORITIES
)

print("Final decision:")
print(decision)
print("\n===== TEST 18: PERSON 1 INTEGRATION =====")

from scheduler.integration import schedule_workflow_tasks
from scheduler.config import NORMAL_PRIORITIES

person1_tasks = [
    {
        "task": "Analyze customer complaints",
        "type": "analysis",
        "complexity": "high",
        "accuracy_requirement": 0.95,
        "urgency": "high"
    }
]

integration_results = schedule_workflow_tasks(
    person1_tasks,
    NORMAL_PRIORITIES
)

for result in integration_results:
    print(result)