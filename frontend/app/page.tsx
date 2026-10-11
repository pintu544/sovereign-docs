"use client";

import { useCallback, useEffect, useState } from "react";
import UploadZone from "./components/UploadZone";
import DocumentList from "./components/DocumentList";
import PrivacyPanel from "./components/PrivacyPanel";
import ChatPanel, { type ChatMessage } from "./components/ChatPanel";
import CitationPanel from "./components/CitationPanel";
import {
  getPrivacy,
  listDocuments,
  type Citation,
  type DocumentInfo,
  type PrivacyInfo,
} from "./lib/api";

export default function Home() {
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [privacy, setPrivacy] = useState<PrivacyInfo | null>(null);
  const [privacyLoading, setPrivacyLoading] = useState(true);
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);
  const [backendDown, setBackendDown] = useState(false);

  const refreshDocuments = useCallback(async () => {
    try {
      const docs = await listDocuments();
      setDocuments(docs);
      setBackendDown(false);
      // auto-select newly added documents
      setSelected((prev) => {
        const next = new Set(prev);
        for (const d of docs) next.add(d.document_id);
        return next;
      });
    } catch {
      setBackendDown(true);
    }
  }, []);

  const refreshPrivacy = useCallback(async () => {
    setPrivacyLoading(true);
    try {
      setPrivacy(await getPrivacy());
    } catch {
      setPrivacy(null);
    } finally {
      setPrivacyLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshDocuments();
    refreshPrivacy();
  }, [refreshDocuments, refreshPrivacy]);

  // prune selection when documents are deleted
  useEffect(() => {
    setSelected((prev) => {
      const ids = new Set(documents.map((d) => d.document_id));
      const next = new Set([...prev].filter((id) => ids.has(id)));
      return next.size === prev.size ? prev : next;
    });
  }, [documents]);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-lg text-white">
            🔒
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">Sovereign Docs</h1>
            <p className="text-xs text-slate-500">
              Your documents. Your device. Your AI.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="hidden sm:inline">Powered by</span>
          <span className="rounded-md bg-slate-100 px-2 py-1 font-mono font-medium text-slate-700">
            Apertus 8B · local
          </span>
        </div>
      </header>

      {backendDown && (
        <div
          className="bg-red-50 px-6 py-2 text-center text-sm text-red-700"
          role="alert"
        >
          Backend not reachable at{" "}
          {process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}. Start
          the FastAPI server and refresh.
        </div>
      )}

      <div className="flex min-h-0 flex-1">
        <aside className="flex w-80 shrink-0 flex-col gap-4 overflow-y-auto border-r border-slate-200 bg-slate-50 p-4">
          <UploadZone onUploaded={refreshDocuments} />
          <div>
            <h2 className="mb-2 text-sm font-semibold text-slate-800">
              Documents
            </h2>
            <DocumentList
              documents={documents}
              selected={selected}
              onToggle={toggleSelect}
              onSelectAll={() =>
                setSelected(new Set(documents.map((d) => d.document_id)))
              }
              onClearAll={() => setSelected(new Set())}
              onChanged={refreshDocuments}
            />
          </div>
          <div className="mt-auto">
            <PrivacyPanel privacy={privacy} loading={privacyLoading} />
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <ChatPanel
            selectedDocs={[...selected]}
            onNewAnswer={(_: ChatMessage) => {}}
            onCitationClick={setActiveCitation}
            onPrivacyRefresh={refreshPrivacy}
          />
        </main>

        <CitationPanel
          citation={activeCitation}
          onClose={() => setActiveCitation(null)}
        />
      </div>
    </div>
  );
}
