from agents.llm_analyzer import analyze_with_llm


def analyze_workflow(user_request):

    # Try Gemini first
    llm_result = analyze_with_llm(user_request)

    if llm_result is not None:
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
            "description": part.capitalize(),
            "accuracy_required": 0.80,
            "latency_limit": 15,
            "urgent": False,
            "can_defer": True
        }

        # Verification / checking tasks
        if "verify" in part.lower() or "check" in part.lower():

            task["accuracy_required"] = 0.90
            task["latency_limit"] = 10
            task["urgent"] = True
            task["can_defer"] = False

        # Analysis tasks
        elif "analyze" in part.lower() or "analyse" in part.lower():

            task["accuracy_required"] = 0.80
            task["latency_limit"] = 5
            task["urgent"] = True
            task["can_defer"] = False

        # Summary / report tasks
        elif (
            "summarize" in part.lower()
            or "summary" in part.lower()
            or "report" in part.lower()
        ):

            task["accuracy_required"] = 0.80
            task["latency_limit"] = 15
            task["urgent"] = False
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

    print("\nWorkflow Deadline:", result["workflow_deadline"], "minutes")