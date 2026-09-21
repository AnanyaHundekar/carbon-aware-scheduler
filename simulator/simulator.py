models = {
    "Small": {
        "accuracy": 0.80,
        "latency": 1.0,
        "cost": 0.01,
        "energy": 3.0
    },

    "Medium": {
        "accuracy": 0.94,
        "latency": 2.0,
        "cost": 0.03,
        "energy": 6.0
    },

    "Large": {
        "accuracy": 0.98,
        "latency": 4.0,
        "cost": 0.10,
        "energy": 15.0
    }
}

locations = {
    "India": {
        "latency_factor": 1.0,
        "cost_factor": 1.0,
        "carbon_factor": 0.8
    },

    "Europe": {
        "latency_factor": 1.3,
        "cost_factor": 1.1,
        "carbon_factor": 0.6
    },

    "US": {
        "latency_factor": 1.5,
        "cost_factor": 1.2,
        "carbon_factor": 1.1
    }
}

time_slots = {
    "Now": {
        "carbon_factor": 1.2
    },

    "+15 min": {
        "carbon_factor": 0.9
    },

    "+30 min": {
        "carbon_factor": 0.7
    },

    "+60 min": {
        "carbon_factor": 0.5
    }
}

def get_available_options(task=None):

    if task is None:
        complexity = "medium"
    else:
        complexity = task.get("complexity", "medium")

    options = []
    suitable_models = {
        "low": ["Small", "Medium", "Large"],
        "medium": ["Medium", "Large"],
        "high": ["Large"]
    }

    allowed_models = suitable_models.get(
        complexity,
        ["Small", "Medium", "Large"]
    )

    workload_factor = {
        "low": 0.7,
        "medium": 1.0,
        "high": 1.5
    }.get(complexity, 1.0)

    for model_name, model in models.items():
        if model_name not in allowed_models:
            continue
        for location_name, location in locations.items():
            for time_name, time in time_slots.items():

                latency = (
                    model["latency"]
                    * workload_factor
                    * location["latency_factor"]
                )

                cost = (
                    model["cost"]
                    * location["cost_factor"]
                )

                energy = model["energy"] * workload_factor

                carbon = (
                    energy
                    * location["carbon_factor"]
                    * time["carbon_factor"]
                )

                option = {
                    "model": model_name,
                    "location": location_name,
                    "time": time_name,
                    "accuracy": model["accuracy"],
                    "latency": latency,
                    "cost": cost,
                    "energy": energy,
                    "carbon": carbon
                }

                options.append(option)

    return options

def get_baseline_option(task=None):
    options = get_available_options(task)
    for option in options:
        if (
            option["model"] == "Large"
            and option["location"] == "US"
            and option["time"] == "Now"
        ):
            return option

if __name__ == "__main__":
    options = get_available_options()

    print("Number of options:", len(options))

    for option in options[:5]:
        print(option)
    baseline = get_baseline_option()

    print("\nBaseline:")
    print(baseline)


