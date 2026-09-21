def calculate_carbon(energy, carbon_intensity):
    """
    Calculate estimated carbon emissions.

    energy:
        Energy consumed by the execution.

    carbon_intensity:
        Carbon intensity of the electricity at that time.
    """

    return energy * carbon_intensity


def apply_carbon_intensity(options, forecast):
    """
    Calculate time-dependent carbon emissions
    for each execution option.
    """

    updated_options = []

    for option in options:
        updated_option = option.copy()

        matching_forecast = next(
            (
                item
                for item in forecast
                if item["start_delay"] == option["start_delay"]
            ),
            None
        )

        if matching_forecast:
            carbon_intensity = matching_forecast["carbon_intensity"]

            updated_option["carbon_intensity"] = carbon_intensity

            updated_option["calculated_carbon"] = calculate_carbon(
                option["energy"],
                carbon_intensity
            )

        updated_options.append(updated_option)

    return updated_options