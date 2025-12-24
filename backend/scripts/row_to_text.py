# def row_to_human_text(row: dict, dataset_name: str = "") -> str:
#     lines = []

#     # Remove non-semantic columns (MANDATORY)
#     for junk in ["Index", "index", "Row", "Unnamed: 0"]:
#         row.pop(junk, None)

#     # Dataset-specific handling ONLY where needed
#     if "crop" in dataset_name and "production" in dataset_name:
#         FIELD_MAP = {
#             "State Name": "State",
#             "District Name": "District",
#             "Crop Year": "Year",
#             "Season": "Season",
#             "Crop": "Crop",
#             "Area": "Area cultivated",
#             "Production": "Total production",
#         }

#         for key, label in FIELD_MAP.items():
#             val = row.get(key)
#             if val:
#                 if key == "Area":
#                     lines.append(f"{label}: {val} hectares")
#                 elif key == "Production":
#                     lines.append(f"{label}: {val} tonnes")
#                 else:
#                     lines.append(f"{label}: {val}")

#     # SAFE fallback (MANDATORY)
#     else:
#         for key, val in row.items():
#             if val:
#                 label = key.replace("_", " ").title()
#                 lines.append(f"{label}: {val}")

#     return "\n".join(lines)
def row_to_human_text(row: dict, dataset_name: str = "") -> str:
    lines = []

    # ---------------------------
    # Normalize column names ONCE
    # ---------------------------
    normalized = {}
    for k, v in row.items():
        if v is None or v == "":
            continue
        key = k.strip().lower().replace("_", " ")
        normalized[key] = v

    # Remove non-semantic junk
    for junk in ["index", "row", "unnamed: 0"]:
        normalized.pop(junk, None)

    # ---------------------------
    # Crop production dataset
    # ---------------------------
    if "crop" in dataset_name:
        FIELD_MAP = {
            "state name": "State",
            "district name": "District",
            "crop year": "Year",
            "season": "Season",
            "crop": "Crop",
            "area": "Area cultivated",
            "production": "Total production",
        }

        for key, label in FIELD_MAP.items():
            if key not in normalized:
                continue

            value = normalized[key]

            if key == "area":
                lines.append(f"{label}: {value} hectares")
            elif key == "production":
                lines.append(f"{label}: {value} tonnes")
            else:
                lines.append(f"{label}: {value}")

    # ---------------------------
    # Safe fallback for other datasets
    # ---------------------------
    else:
        for key, value in normalized.items():
            label = key.title()
            lines.append(f"{label}: {value}")

    return "\n".join(lines)
