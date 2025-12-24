import os
os.environ["TOKENIZERS_PARALLELISM"] = "false"
import numpy as np
from sentence_transformers import SentenceTransformer

# Best free embedding model for RAG
MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

# Load globally once — speeds up processing
model = SentenceTransformer(MODEL_NAME)


def get_embeddings(text_chunks, batch_size=256):
    """
    Generate embeddings for a list of text chunks using
    SentenceTransformer with batching for speed and memory safety.
    """

    all_embeddings = []

    print(f"🚀 Using FREE embedding model: {MODEL_NAME}")
    print(f"🔄 Generating embeddings in batches of {batch_size}...")

    # Process in batches
    for i in range(0, len(text_chunks), batch_size):
        batch = text_chunks[i : i + batch_size]

        batch_embeddings = model.encode(
            batch,
            convert_to_numpy=True,
            normalize_embeddings=True,  # ✔ Keeps vectors FAISS-friendly
            show_progress_bar=False
        )

        all_embeddings.append(batch_embeddings)

        if i % (batch_size * 20) == 0:
            print(f"   → processed {i}/{len(text_chunks)} chunks")

    # Combine all batches into one array
    embeddings = np.vstack(all_embeddings)

    print(f"✅ Embeddings created successfully: {embeddings.shape}")

    return embeddings
