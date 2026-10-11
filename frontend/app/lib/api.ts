const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface DocumentInfo {
  document_id: string;
  filename: string;
  page_count: number;
  chunk_count: number;
  uploaded_at: number;
}

export interface Citation {
  page: number;
  text_snippet: string;
  document_id: string;
}

export interface AskResponse {
  answer: string;
  citations: Citation[];
  latency_ms: number;
}

export interface PrivacyInfo {
  external_requests: number;
  model: string;
  inference: string;
}

async function handle(res: Response) {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

export async function listDocuments(): Promise<DocumentInfo[]> {
  const res = await fetch(`${API_BASE}/api/documents`);
  return handle(res);
}

export async function uploadDocument(file: File): Promise<DocumentInfo> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API_BASE}/api/documents`, {
    method: "POST",
    body: form,
  });
  return handle(res);
}

export async function deleteDocument(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/documents/${id}`, {
    method: "DELETE",
  });
  await handle(res);
}

export async function askQuestion(
  question: string,
  document_ids: string[]
): Promise<AskResponse> {
  const res = await fetch(`${API_BASE}/api/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, document_ids }),
  });
  return handle(res);
}

export async function getPrivacy(): Promise<PrivacyInfo> {
  const res = await fetch(`${API_BASE}/api/privacy`);
  return handle(res);
}
