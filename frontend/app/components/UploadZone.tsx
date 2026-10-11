"use client";

import { useRef, useState } from "react";
import { uploadDocument } from "../lib/api";

export default function UploadZone({ onUploaded }: { onUploaded: () => void }) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setError("Only PDF files are accepted.");
      return;
    }
    setError(null);
    setUploading(true);
    try {
      await uploadDocument(file);
      onUploaded();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
          dragOver
            ? "border-emerald-500 bg-emerald-50"
            : "border-slate-300 bg-white hover:border-slate-400"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="text-3xl" aria-hidden>
          📄
        </div>
        <p className="mt-2 text-sm font-medium text-slate-700">
          {uploading ? "Uploading & indexing…" : "Drop a PDF here or click to browse"}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Text-based PDFs. Processed locally — nothing leaves this machine.
        </p>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
