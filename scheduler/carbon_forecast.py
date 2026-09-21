def get_carbon_forecast():
    """
    Simulated carbon intensity forecast.

    Lower carbon intensity means cleaner electricity.
    """

    return [
        {
            "time": "Now",
            "start_delay": 0,
            "carbon_intensity": 0.80
        },
        {
            "time": "+15 min",
            "start_delay": 15,
            "carbon_intensity": 0.40
        },
        {
            "time": "+30 min",
            "start_delay": 30,
            "carbon_intensity": 0.25
        },
        {
            "time": "+45 min",
            "start_delay": 45,
            "carbon_intensity": 0.60
        }
    ]


def get_cleanest_time():
    forecast = get_carbon_forecast()

    return min(
        forecast,
        key=lambda option: option["carbon_intensity"]
    )