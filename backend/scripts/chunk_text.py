def chunk_text(text: str):
    chunks = []
    current_chunk = []

    for line in text.splitlines():
        line = line.strip()

        if not line or line == "---":
            continue

        if (
            line.startswith("Pest Name:")
            or line.startswith("Question:")
            or line.startswith("Crop:")
            or line.startswith("Disease Or Pest:")
        ):
            if current_chunk:
                chunk = " ".join(current_chunk)
                if len(chunk) >= 40:
                    chunks.append(chunk)
                current_chunk = []

        current_chunk.append(line)

    if current_chunk:
        chunk = " ".join(current_chunk)
        if len(chunk) >= 40:
            chunks.append(chunk)

    return chunks
