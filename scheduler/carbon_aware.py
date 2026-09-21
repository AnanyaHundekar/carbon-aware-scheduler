from scheduler.carbon_forecast import get_carbon_forecast
from scheduler.carbon_calculator import apply_carbon_intensity


def prepare_carbon_aware_options(options):
    """
    Add time-dependent carbon information to execution options.
    """

    forecast = get_carbon_forecast()

    return apply_carbon_intensity(
        options,
        forecast
    )