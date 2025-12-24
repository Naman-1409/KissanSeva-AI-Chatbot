🌾 KissanSeva AI Chatbot (KrishiGPT)

An AI-powered assistant that helps farmers with crop guidance, disease and pest identification, fertilizer and pesticide recommendations, weather-aware practices, and modern farming techniques — grounded in curated, domain-specific datasets.

The system is designed to answer strictly from trusted data sources and a local FAISS knowledge base for reliability and relevance.

---

✨ Features

- 🤖 AI QA from curated knowledge: Answers constrained to vetted datasets
- 🌱 Crop, pest, and disease guidance: Practical, actionable recommendations
- 🧪 Fertilizer and pesticide suggestions: Safer agricultural practices
- 🖼️ Image understanding: Hooks for vision-based crop/disease analysis
- 🗣️ Voice input ready: Hooks for voice-based queries
- 🌍 Multilingual friendly: Frontend ready for localization
- ⚛️ Modern React frontend: Vite + Tailwind styling
- 🧠 Embeddings + FAISS: Local vector search over cleaned knowledge

---

🧭 Architecture Overview

- Frontend: React (Vite), Tailwind styles. Talks to a backend via REST.
- Data pipeline (Python scripts):
  - CSV ➜ cleaned text blocks ➜ embeddings ➜ FAISS index
- Vector store: FAISS index built from curated datasets in \`backend/data\`.
- Backend (expected): FastAPI server exposing \`/health\`, \`/api/chat\`, \`/api/image\`, \`/api/voice\`.

---

📁 Repository Structure

\`\`\`
KissanSeva-AI-Chatbot/
  backend/
    data/
      raw_csv/              # Input CSVs (source datasets)
      cleaned_text/         # Generated knowledge text blocks
    scripts/                # Data processing + vector store build
      csv_to_knowledge.py   # CSV ➜ cleaned text (.txt) per row/block
      row_to_text.py        # Row ➜ readable knowledge text
      clean_csv.py          # Basic cleaning/normalization helpers
      chunk_text.py         # Windowed chunking for embeddings
      create_embeddings.py  # SentenceTransformer embeddings
      build_faiss_index.py  # Build FAISS + persist index/metadata
    vector_store/
      faiss_index/
        knowledge.index     # FAISS index (already present)
        metadata.pkl        # Saved metadata (created by build script)
        chunks.pkl          # Saved text chunks (created by build script)
  frontend/
    src/                    # React app
    package.json            # Vite/Tailwind toolchain
\`\`\`

---

🚀 Quickstart

Prerequisites

- Node.js ≥ 18 and npm
- Python ≥ 3.9
- macOS/Linux/Windows

1) Install and run the frontend

\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

By default the app expects a backend at \`http://localhost:8000\`. You can change this in [frontend/src/App.jsx](frontend/src/App.jsx#L6-L8): \`API_BASE\` and \`HEALTH_CHECK_URL\`.

2) Prepare Python environment for data pipeline

\`\`\`bash
cd ../backend
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install --upgrade pip
pip install sentence-transformers faiss-cpu pandas numpy
\`\`\`

3) Generate cleaned knowledge files from CSVs

\`\`\`bash
python scripts/csv_to_knowledge.py
\`\`\`

This reads from [backend/data/raw_csv](backend/data/raw_csv) and writes \`.txt\` blocks to [backend/data/cleaned_text](backend/data/cleaned_text).

4) Build the FAISS index

\`\`\`bash
python scripts/build_faiss_index.py
\`\`\`

This creates/updates the vector store under [backend/vector_store/faiss_index](backend/vector_store/faiss_index).

---

🛰️ Backend API Expectations

The frontend is wired for a FastAPI backend running at \`http://localhost:8000\`.

- \`GET /health\`
  - Returns 200 when the service is ready.

- \`POST /api/chat\`
  - Body: \`{ "query": string, "context": { "crop": string, "location": string, "season": string, "features": { "N": number, "P": number, "K": number, "temperature": number, "humidity": number, "ph": number, "rainfall": number } } }\`
  - Response: \`{ "answer": string, "intent"?: string, "confidence"?: number, "escalation_id"?: string }\`

- \`POST /api/image\` (multipart/form-data)
  - Fields: \`file\` (image), \`crop\`, \`location\`, \`season\`
  - Response: \`{ "label": string, "confidence": number, "remedy": string, "used_model": string, "escalation_id"?: string }\`

- \`POST /api/voice\` (multipart/form-data)
  - Fields: \`file\` (audio), \`crop\`, \`location\`, \`season\`
  - Response: \`{ "answer": string }\`

If you are implementing the backend, ensure it loads the FAISS resources from [backend/vector_store/faiss_index](backend/vector_store/faiss_index) and uses the same embedding model as in [backend/scripts/create_embeddings.py](backend/scripts/create_embeddings.py).

---

🧩 Data Pipeline Details

- Cleaning/normalization: [backend/scripts/clean_csv.py](backend/scripts/clean_csv.py)
- Per-row text rendering: [backend/scripts/row_to_text.py](backend/scripts/row_to_text.py)
- Chunking: [backend/scripts/chunk_text.py](backend/scripts/chunk_text.py) (word windowing with overlap)
- Embeddings: [backend/scripts/create_embeddings.py](backend/scripts/create_embeddings.py) (\`all-MiniLM-L6-v2\`)
- FAISS build: [backend/scripts/build_faiss_index.py](backend/scripts/build_faiss_index.py)

You can re-run steps any time after updating CSVs:

\`\`\`bash
python scripts/csv_to_knowledge.py && python scripts/build_faiss_index.py
\`\`\`

---

🛠️ Troubleshooting

- FAISS install on macOS (Apple Silicon): prefer \`pip install faiss-cpu\`. If you hit issues, try a Conda environment and \`conda install -c pytorch faiss-cpu\`.
- Model download time: \`sentence-transformers\` will download \`all-MiniLM-L6-v2\` on first run; allow a few minutes.
- CORS/frontend 404s: confirm the backend base URL in [frontend/src/App.jsx](frontend/src/App.jsx#L6-L8) matches your server.
- Health check failing: the UI shows a system message if \`GET /health\` is down — start the FastAPI server or adjust the URL.

---

🤝 Contributing

Pull requests are welcome! For significant changes, please open an issue first to discuss what you’d like to change.

---

📜 License

If a license is intended for this project, add a \`LICENSE\` file at the repository root. Until then, all rights reserved by the authors/owners.

---

💡 Project Goal

Empower farmers with accurate, fast, and easy-to-understand agricultural knowledge using AI — while ensuring trustworthiness by relying on verified, domain-specific datasets.
