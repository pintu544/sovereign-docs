"use client";

import type { Citation } from "../lib/api";

export default function CitationPanel({
  citation,
  onClose,
}: {
  citation: Citation | null;
  onClose: () => void;
}) {
  if (!citation) return null;

  return (
    <aside className="flex w-80 shrink-0 flex-col border-l border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-slate-800">
          Source · Page {citation.page}
        </h2>
        <button
          onClick={onClose}
          className="rounded px-2 py-1 text-sm text-slate-500 hover:bg-slate-100"
          aria-label="Close citation panel"
        >
          ✕
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <p className="rounded-lg bg-slate-50 p-3 font-mono text-xs leading-relaxed text-slate-700">
          “…{citation.text_snippet}…”
        </p>
        <dl className="mt-3 space-y-1 text-xs text-slate-500">
          <div className="flex justify-between">
            <dt>Page</dt>
            <dd className="font-medium text-slate-700">{citation.page}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Document</dt>
            <dd
              className="max-w-40 truncate font-mono font-medium text-slate-700"
              title={citation.document_id}
            >
              {citation.document_id}
            </dd>
          </div>
        </dl>
        <p className="mt-4 text-[11px] leading-relaxed text-slate-400">
          This passage was retrieved from your local index and fed to Apertus
          as context. It never left this machine.
        </p>
      </div>
    </aside>
  );
}
