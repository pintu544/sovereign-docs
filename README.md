# Sovereign Docs

**Your documents. Your device. Your AI.**

Private AI document assistant powered by Apertus 8B running 100% locally. Upload PDFs, ask questions, get answers with page citations — with proof that nothing leaves your machine.

Built for [Hack Apertus 2026](https://hackapertus.ch/), Track 2B: Own Project.

## The Pitch

> "No cloud. No API key. No document uploads. This is sovereign AI powered by Apertus."

## Demo

Watch it in action: [Sovereign Docs demo video](https://youtu.be/HNhBvEReyTY)

## Architecture

- **Frontend:** Next.js 16 + Tailwind CSS (`frontend/`)
- **Backend:** FastAPI + PyMuPDF + FAISS (`backend/`)
- **Model:** Apertus v1.5 8B (GGUF Q4_K_M) via llama.cpp
- **Embeddings:** all-MiniLM-L6-v2 (local, open-weights)

All components run on localhost. Zero external network calls.

## Quick Start

### 1. Download the model (~4.8 GB)

From Hugging Face ([swiss-ai/Apertus-v1.5-8B](https://huggingface.co/swiss-ai/Apertus-v1.5-8B)):
```bash
mkdir -p models
# Download apertus-v1.5-8b-text-q4_k_m.gguf into models/
```

### 2. Start Apertus (llama.cpp)

```bash
# Build llama.cpp (first time only)
cmake -B llama.cpp/build -S llama.cpp
cmake --build llama.cpp/build --config Release

# Serve the model
./llama.cpp/build/bin/llama-server \
  -m models/apertus-v1.5-8b-text-q4_k_m.gguf \
  --port 8080 -c 2048
```

### 3. Start the backend

```bash
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
# Download embedding model (first time only)
python3 -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2').save('minilm-local')"
./start.sh  # → http://localhost:8000
```

### 4. Start the frontend

```bash
cd frontend
npm install
npm run dev  # → http://localhost:3000
```

## API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/documents` | POST | Upload PDF (multipart) |
| `/api/documents` | GET | List documents |
| `/api/documents/{id}` | DELETE | Delete document |
| `/api/ask` | POST | Ask question → `{ answer, citations, latency_ms }` |
| `/api/privacy` | GET | Privacy verification → `{ external_requests: 0, ... }` |
| `/api/health` | GET | Health check |

## Sovereign Deployability

- **On-premise:** Entire stack runs on your infrastructure (`docker compose up` or three processes).
- **Air-gapped:** Demonstrated — with network disconnected, the app keeps working. Nothing to phone home to.
- **Cost:** $0 inference. Runs on a laptop.

## License

MIT — see [LICENSE](LICENSE).
