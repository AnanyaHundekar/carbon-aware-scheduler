def normalize(value, minimum, maximum):
    if maximum == minimum:
        return 0

    return (value - minimum) / (maximum - minimum)


def calculate_scores(options, priorities):
    if not options:
        return []

    # Collect metric values
    latencies = [
        option["latency"]
        for option in options
    ]

    costs = [
        option["cost"]
        for option in options
    ]

    energies = [
        option["energy"]
        for option in options
    ]

    # Use calculated_carbon when available.
    # Otherwise fall back to the original carbon value.
    carbons = [
        option.get(
            "calculated_carbon",
            option["carbon"]
        )
        for option in options
    ]

    accuracies = [
        option["accuracy"]
        for option in options
    ]

    # Find ranges for normalization
    min_latency, max_latency = (
        min(latencies),
        max(latencies)
    )

    min_cost, max_cost = (
        min(costs),
        max(costs)
    )

    min_energy, max_energy = (
        min(energies),
        max(energies)
    )

    min_carbon, max_carbon = (
        min(carbons),
        max(carbons)
    )

    min_accuracy, max_accuracy = (
        min(accuracies),
        max(accuracies)
    )

    scored_options = []

    for option in options:

        # Lower latency is better
        latency_score = normalize(
            option["latency"],
            min_latency,
            max_latency
        )

        # Lower cost is better
        cost_score = normalize(
            option["cost"],
            min_cost,
            max_cost
        )

        # Lower energy is better
        energy_score = normalize(
            option["energy"],
            min_energy,
            max_energy
        )

        # Lower carbon is better
        carbon_value = option.get(
            "calculated_carbon",
            option["carbon"]
        )

        carbon_score = normalize(
            carbon_value,
            min_carbon,
            max_carbon
        )

        # Higher accuracy is better
        # Therefore invert the normalized value.
        accuracy_score = 1 - normalize(
            option["accuracy"],
            min_accuracy,
            max_accuracy
        )

        # Apply priorities / weights
        latency_contribution = (
            priorities.get("latency", 0)
            * latency_score
        )

        accuracy_contribution = (
            priorities.get("accuracy", 0)
            * accuracy_score
        )

        cost_contribution = (
            priorities.get("cost", 0)
            * cost_score
        )

        energy_contribution = (
            priorities.get("energy", 0)
            * energy_score
        )

        carbon_contribution = (
            priorities.get("carbon", 0)
            * carbon_score
        )

        # Total score
        # Lower score = better option
        total_score = (
            latency_contribution
            + accuracy_contribution
            + cost_contribution
            + energy_contribution
            + carbon_contribution
        )

        # Copy original option
        scored_option = option.copy()

        scored_option["score"] = total_score

        scored_option["score_breakdown"] = {
            "latency": latency_contribution,
            "accuracy": accuracy_contribution,
            "cost": cost_contribution,
            "energy": energy_contribution,
            "carbon": carbon_contribution
        }

        scored_options.append(scored_option)

    return scored_options


def select_best_option(scored_options):
    if not scored_options:
        return None

    return min(
        scored_options,
        key=lambda option: option["score"]
    )