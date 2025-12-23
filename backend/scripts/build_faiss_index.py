import os
import pickle
import faiss
from chunk_text import chunk_text
from create_embeddings import get_embeddings

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
TEXT_DIR = os.path.join(BASE_DIR, "data", "cleaned_text")
FAISS_DIR = os.path.join(BASE_DIR, "vector_store", "faiss_index")

os.makedirs(FAISS_DIR, exist_ok=True)

all_chunks = []
metadata = []

# Step 1: Read all text files
for file in os.listdir(TEXT_DIR):
    if not file.endswith(".txt"):
        continue

    file_path = os.path.join(TEXT_DIR, file)
    with open(file_path, "r", encoding="utf-8") as f:
        text = f.read()

    chunks = chunk_text(text)

    for chunk in chunks:
        all_chunks.append(chunk)
        metadata.append({
            "source_file": file
        })

print(f"Total chunks created: {len(all_chunks)}")

# Step 2: Create embeddings
embeddings = get_embeddings(all_chunks)

# Step 3: Create FAISS index
dimension = embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(embeddings)

# Step 4: Save index and metadata
faiss.write_index(index, os.path.join(FAISS_DIR, "knowledge.index"))

with open(os.path.join(FAISS_DIR, "metadata.pkl"), "wb") as f:
    pickle.dump(metadata, f)

with open(os.path.join(FAISS_DIR, "chunks.pkl"), "wb") as f:
    pickle.dump(all_chunks, f)

print("✅ FAISS index created successfully")
