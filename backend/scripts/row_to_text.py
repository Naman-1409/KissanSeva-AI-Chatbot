def row_to_human_text(row: dict, title: str = None):
    lines = []

    if title:
        lines.append(f"{title}\n")

    for col, val in row.items():
        if val is None or val == "":
            continue

        col_name = col.replace("_", " ").title()
        lines.append(f"{col_name}: {val}")

    return "\n".join(lines)
