import os
import pickle
import faiss

os.environ["TOKENIZERS_PARALLELISM"] = "false"

from chunk_text import chunk_text
from create_embeddings import get_embeddings

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
TEXT_DIR = os.path.join(BASE_DIR, "data", "cleaned_text")
FAISS_DIR = os.path.join(BASE_DIR, "vector_store", "faiss_index")

os.makedirs(FAISS_DIR, exist_ok=True)

all_chunks = []
metadata = []

print("📥 Reading cleaned text files...")

for file in os.listdir(TEXT_DIR):
    if not file.endswith(".txt"):
        continue

    dataset_name = file.replace(".txt", "").lower()
    file_path = os.path.join(TEXT_DIR, file)

    with open(file_path, "r", encoding="utf-8") as f:
        text = f.read()

    chunks = chunk_text(text)

    print(f"  {file}: {len(chunks)} chunks")

    for chunk in chunks:
        all_chunks.append(chunk)
        metadata.append({
            "source": dataset_name,
            "source_file": file
        })

print(f"\n✅ Total chunks created: {len(all_chunks)}")

# --------------------------------------------------
# CREATE EMBEDDINGS (GROQ)
# --------------------------------------------------

embeddings = get_embeddings(all_chunks)

# --------------------------------------------------
# BUILD FAISS INDEX
# --------------------------------------------------

dimension = embeddings.shape[1]
print(f"🔧 Embedding dimension: {dimension}")

index = faiss.IndexFlatL2(dimension)
index.add(embeddings)

print("📦 Saving FAISS index...")

# --------------------------------------------------
# SAVE INDEX + DATA
# --------------------------------------------------

faiss.write_index(index, os.path.join(FAISS_DIR, "knowledge.index"))

with open(os.path.join(FAISS_DIR, "metadata.pkl"), "wb") as f:
    pickle.dump(metadata, f)

with open(os.path.join(FAISS_DIR, "chunks.pkl"), "wb") as f:
    pickle.dump(all_chunks, f)

print("✅ FAISS index rebuilt successfully using Groq embeddings!")
