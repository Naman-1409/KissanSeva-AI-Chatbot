def row_to_human_text(row: dict, dataset_name: str = "") -> str:
    lines = []

    # Remove non-semantic columns (MANDATORY)
    for junk in ["Index", "index", "Row", "Unnamed: 0"]:
        row.pop(junk, None)

    # Dataset-specific handling ONLY where needed
    if "crop" in dataset_name and "production" in dataset_name:
        FIELD_MAP = {
            "State Name": "State",
            "District Name": "District",
            "Crop Year": "Year",
            "Season": "Season",
            "Crop": "Crop",
            "Area": "Area cultivated",
            "Production": "Total production",
        }

        for key, label in FIELD_MAP.items():
            val = row.get(key)
            if val:
                if key == "Area":
                    lines.append(f"{label}: {val} hectares")
                elif key == "Production":
                    lines.append(f"{label}: {val} tonnes")
                else:
                    lines.append(f"{label}: {val}")

    # SAFE fallback (MANDATORY)
    else:
        for key, val in row.items():
            if val:
                label = key.replace("_", " ").title()
                lines.append(f"{label}: {val}")

    return "\n".join(lines)

