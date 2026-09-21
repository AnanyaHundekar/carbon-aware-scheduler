# scheduler/constraints.py


def check_constraints(task, option):
    """
    Check whether an execution option satisfies
    all hard constraints.
    """

    # Accuracy requirement
    required_accuracy = task.get("accuracy_requirement")

    if required_accuracy is not None:
        if option["accuracy"] < required_accuracy:
            return False

    # Maximum latency
    max_latency = task.get("max_latency")

    if max_latency is not None:
        if option["latency"] > max_latency:
            return False

    # Maximum cost
    max_cost = task.get("max_cost")

    if max_cost is not None:
        if option["cost"] > max_cost:
            return False

    # Maximum energy
    max_energy = task.get("max_energy")

    if max_energy is not None:
        if option["energy"] > max_energy:
            return False

    # Maximum carbon
    max_carbon = task.get("max_carbon")

    if max_carbon is not None:
        if option["carbon"] > max_carbon:
            return False

    # Carbon budget
    carbon_budget = task.get("carbon_budget")

    if carbon_budget is not None:
        if option["carbon"] > carbon_budget:
            return False

    # Deadline
    deadline = task.get("deadline")

    if deadline is not None:
        completion_time = (
            option["start_delay"]
            + option["latency_minutes"]
        )

        if completion_time > deadline:
            return False

    return True


def filter_valid_options(task, options):
    """
    Return only the options that satisfy
    all hard constraints.
    """

    valid_options = []

    for option in options:
        if check_constraints(task, option):
            valid_options.append(option)

    return valid_options


def explain_constraint_failures(task, options):
    """
    Explain why available options failed
    the hard constraints.
    """

    failures = []

    for option in options:

        option_failures = []

        # Accuracy
        required_accuracy = task.get("accuracy_requirement")

        if (
            required_accuracy is not None
            and option["accuracy"] < required_accuracy
        ):
            option_failures.append(
                f"accuracy {option['accuracy']:.0%} "
                f"< required {required_accuracy:.0%}"
            )

        # Latency
        max_latency = task.get("max_latency")

        if (
            max_latency is not None
            and option["latency"] > max_latency
        ):
            option_failures.append(
                f"latency {option['latency']} "
                f"> maximum {max_latency}"
            )

        # Cost
        max_cost = task.get("max_cost")

        if (
            max_cost is not None
            and option["cost"] > max_cost
        ):
            option_failures.append(
                f"cost {option['cost']} "
                f"> maximum {max_cost}"
            )

        # Energy
        max_energy = task.get("max_energy")

        if (
            max_energy is not None
            and option["energy"] > max_energy
        ):
            option_failures.append(
                f"energy {option['energy']} "
                f"> maximum {max_energy}"
            )

        # Carbon
        max_carbon = task.get("max_carbon")

        if (
            max_carbon is not None
            and option["carbon"] > max_carbon
        ):
            option_failures.append(
                f"carbon {option['carbon']} "
                f"> maximum {max_carbon}"
            )

        # Carbon budget
        carbon_budget = task.get("carbon_budget")

        if (
            carbon_budget is not None
            and option["carbon"] > carbon_budget
        ):
            option_failures.append(
                f"carbon {option['carbon']} "
                f"> remaining budget {carbon_budget}"
            )

        # Deadline
        deadline = task.get("deadline")

        if deadline is not None:

            completion_time = (
                option["start_delay"]
                + option["latency_minutes"]
            )

            if completion_time > deadline:
                option_failures.append(
                    f"completion time {completion_time} min "
                    f"> deadline {deadline} min"
                )

        if option_failures:

            failures.append({
                "model": option["model"],
                "failures": option_failures
            })

    return failures