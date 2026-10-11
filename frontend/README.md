# Sovereign Docs — Frontend

Next.js 16 (App Router) + Tailwind CSS v4. Local-only: the only network calls
are to the FastAPI backend. No analytics, no CDNs, no web fonts (system fonts
only) — the privacy story stays clean.

## Run

```bash
# backend must be running first (see ../backend/)
./start.sh
# or: npm run dev
```

Opens at http://localhost:3000.

`NEXT_PUBLIC_API_URL` (default `http://localhost:8000`) points at the backend.
A `.env.local` with the default is included.

## What's here

| File | Purpose |
|---|---|
| `app/page.tsx` | Layout: header, sidebar, chat, citation panel |
| `app/lib/api.ts` | Typed client for the FastAPI backend |
| `app/components/UploadZone.tsx` | Drag-drop / file-picker PDF upload |
| `app/components/DocumentList.tsx` | Docs with multi-select checkboxes + delete |
| `app/components/ChatPanel.tsx` | Chat UI; parses `[pN]` citations into clickable badges |
| `app/components/CitationPanel.tsx` | Side panel showing the source snippet for a clicked citation |
| `app/components/PrivacyPanel.tsx` | OFFLINE/PRIVATE indicator + model/endpoint/external-request count |
