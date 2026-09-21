from agents.llm_analyzer import analyze_with_llm


def normalize_task(task):
    """
    Convert a task into the standard schema expected by the scheduler.
    """

    description = task.get(
        "description",
        task.get("task", "Unknown task")
    )

    # Support old Gemini field names if they appear
    accuracy = task.get(
        "accuracy_requirement",
        task.get("accuracy_required", 0.80)
    )

    max_latency = task.get(
        "max_latency",
        task.get("latency_limit", 15)
    )

    urgency = task.get("urgency")

    if urgency is None:
        urgent = task.get("urgent", False)
        urgency = "high" if urgent else "normal"

    complexity = task.get("complexity")

    if complexity is None:
        if accuracy >= 0.90:
            complexity = "high"
        elif accuracy >= 0.80:
            complexity = "medium"
        else:
            complexity = "low"

    return {
        "task_id": task.get("task_id"),
        "task": task.get("task", description),
        "description": description,
        "complexity": complexity,
        "accuracy_requirement": accuracy,
        "max_latency": max_latency,
        "urgency": urgency,
        "can_defer": task.get("can_defer", True)
    }


def analyze_workflow(user_request):

    # Try Gemini first
    llm_result = analyze_with_llm(user_request)

    if llm_result is not None:

        llm_result["tasks"] = [
            normalize_task(task)
            for task in llm_result.get("tasks", [])
        ]

        return llm_result

    # Smart rule-based fallback
    tasks = []

    # Split the request into individual tasks
    parts = user_request.replace(" and ", ",").split(",")

    for part in parts:

        part = part.strip()

        if not part:
            continue

        task = {
            "task_id": len(tasks) + 1,
            "task": part.capitalize(),
            "description": part.capitalize(),
            "complexity": "medium",
            "accuracy_requirement": 0.80,
            "max_latency": 15,
            "urgency": "normal",
            "can_defer": True
        }

        # Verification / checking tasks
        if "verify" in part.lower() or "check" in part.lower():

            task["complexity"] = "high"
            task["accuracy_requirement"] = 0.90
            task["max_latency"] = 10
            task["urgency"] = "high"
            task["can_defer"] = False

        # Analysis tasks
        elif "analyze" in part.lower() or "analyse" in part.lower():

            task["complexity"] = "high"
            task["accuracy_requirement"] = 0.80
            task["max_latency"] = 5
            task["urgency"] = "high"
            task["can_defer"] = False

        # Summary / report tasks
        elif (
            "summarize" in part.lower()
            or "summary" in part.lower()
            or "report" in part.lower()
        ):

            task["complexity"] = "low"
            task["accuracy_requirement"] = 0.80
            task["max_latency"] = 15
            task["urgency"] = "normal"
            task["can_defer"] = True

        tasks.append(task)

    return {
        "tasks": tasks,
        "workflow_deadline": 30
    }


if __name__ == "__main__":

    request = input("Enter your workflow request: ")

    result = analyze_workflow(request)

    print("\nWorkflow Tasks:")

    for task in result["tasks"]:
        print(task)

    print(
        "\nWorkflow Deadline:",
        result["workflow_deadline"],
        "minutes"
    )