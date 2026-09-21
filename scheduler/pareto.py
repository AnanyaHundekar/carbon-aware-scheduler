# scheduler/pareto.py


def dominates(option_a, option_b):
    """
    Return True if option_a dominates option_b.

    For minimization metrics:
        lower is better

    For accuracy:
        higher is better
    """

    minimization_metrics = [
        "latency",
        "cost",
        "energy",
        "carbon"
    ]

    better_or_equal = True
    strictly_better = False

    # Check metrics where lower is better
    for metric in minimization_metrics:

        if option_a[metric] > option_b[metric]:
            better_or_equal = False

        if option_a[metric] < option_b[metric]:
            strictly_better = True

    # Accuracy: higher is better
    if option_a["accuracy"] < option_b["accuracy"]:
        better_or_equal = False

    if option_a["accuracy"] > option_b["accuracy"]:
        strictly_better = True

    return better_or_equal and strictly_better


def find_pareto_front(options):
    """
    Return options that are not dominated
    by any other option.
    """

    pareto_options = []

    for option in options:

        dominated = False

        for other in options:

            if option is other:
                continue

            if dominates(other, option):
                dominated = True
                break

        if not dominated:
            pareto_options.append(option)

    return pareto_options