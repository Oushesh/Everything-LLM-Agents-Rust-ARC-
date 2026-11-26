## Goals: 
   
## Directory:
   ficus-scribe-mvp/
├── frontend/                     # Next.js (App Router + TypeScript)
│   └── src/app/page.tsx          # PCM16 AudioWorklet mic streamer + live transcript + summary UI
└── backend/
    ├── rust-gateway/             # Axum WebSocket audio relay + audit logger (Port 8080)
    │   ├── Cargo.toml
    │   └── src/main.rs
    └── python-ai/                # FastAPI structured clinical summary service (Port 8000)
        ├── pyproject.toml
        └── main.py

## Functions: 
   

## Components: 