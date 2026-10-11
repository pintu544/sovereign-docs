"use client";

import { useState } from "react";
import { deleteDocument, type DocumentInfo } from "../lib/api";

interface Props {
  documents: DocumentInfo[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  onChanged: () => void;
}

export default function DocumentList({
  documents,
  selected,
  onToggle,
  onSelectAll,
  onClearAll,
  onChanged,
}: Props) {
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Delete this document and its index?")) return;
    setDeleting(id);
    try {
      await deleteDocument(id);
      onChanged();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed.");
    } finally {
      setDeleting(null);
    }
  }

  if (documents.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        No documents yet. Upload a PDF to start asking questions.
      </p>
    );
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {selected.size} of {documents.length} selected
        </span>
        <div className="flex gap-2 text-xs">
          <button
            onClick={onSelectAll}
            className="text-emerald-700 hover:underline"
          >
            Select all
          </button>
          <button onClick={onClearAll} className="text-slate-500 hover:underline">
            Clear
          </button>
        </div>
      </div>
      <ul className="space-y-2">
        {documents.map((doc) => (
          <li
            key={doc.document_id}
            className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${
              selected.has(doc.document_id)
                ? "border-emerald-400 bg-emerald-50"
                : "border-slate-200 bg-white"
            }`}
          >
            <input
              type="checkbox"
              checked={selected.has(doc.document_id)}
              onChange={() => onToggle(doc.document_id)}
              className="mt-1 h-4 w-4 accent-emerald-600"
              aria-label={`Select ${doc.filename}`}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-800">
                {doc.filename}
              </p>
              <p className="text-xs text-slate-500">
                {doc.page_count} pages · {doc.chunk_count} chunks
              </p>
            </div>
            <button
              onClick={() => handleDelete(doc.document_id)}
              disabled={deleting === doc.document_id}
              className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
              aria-label={`Delete ${doc.filename}`}
            >
              {deleting === doc.document_id ? "…" : "✕"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
