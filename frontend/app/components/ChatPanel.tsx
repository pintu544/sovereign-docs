"use client";

import { useRef, useState } from "react";
import { askQuestion, type AskResponse, type Citation } from "../lib/api";

export interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  text: string;
  citations?: Citation[];
  latency_ms?: number;
  error?: boolean;
}

interface Props {
  selectedDocs: string[];
  onNewAnswer: (msg: ChatMessage) => void;
  onCitationClick: (citation: Citation) => void;
  onPrivacyRefresh: () => void;
}

function renderWithCitations(
  text: string,
  citations: Citation[] | undefined,
  onCitationClick: (c: Citation) => void
) {
  const parts = text.split(/(\[p\d+\])/g);
  return parts.map((part, i) => {
    const m = part.match(/^\[p(\d+)\]$/);
    if (m && citations) {
      const page = parseInt(m[1], 10);
      const citation = citations.find((c) => c.page === page);
      if (citation) {
        return (
          <button
            key={i}
            onClick={() => onCitationClick(citation)}
            className="mx-0.5 inline-block rounded-md bg-emerald-100 px-1.5 py-0.5 align-baseline font-mono text-xs font-semibold text-emerald-800 hover:bg-emerald-200"
            title={`Page ${page} — click to view source`}
          >
            {part}
          </button>
        );
      }
    }
    return <span key={i}>{part}</span>;
  });
}

export default function ChatPanel({
  selectedDocs,
  onNewAnswer,
  onCitationClick,
  onPrivacyRefresh,
}: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  function scrollDown() {
    requestAnimationFrame(() =>
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    );
  }

  async function handleAsk() {
    const question = input.trim();
    if (!question || asking) return;
    if (selectedDocs.length === 0) {
      setError("Select at least one document to ask about.");
      return;
    }
    setError(null);
    setInput("");
    const userMsg: ChatMessage = { id: ++idRef.current, role: "user", text: question };
    setMessages((m) => [...m, userMsg]);
    scrollDown();
    setAsking(true);
    try {
      const res: AskResponse = await askQuestion(question, selectedDocs);
      const assistantMsg: ChatMessage = {
        id: ++idRef.current,
        role: "assistant",
        text: res.answer,
        citations: res.citations,
        latency_ms: res.latency_ms,
      };
      setMessages((m) => [...m, assistantMsg]);
      onNewAnswer(assistantMsg);
    } catch (e) {
      const msg: ChatMessage = {
        id: ++idRef.current,
        role: "assistant",
        text: e instanceof Error ? e.message : "Something went wrong.",
        error: true,
      };
      setMessages((m) => [...m, msg]);
    } finally {
      setAsking(false);
      onPrivacyRefresh();
      scrollDown();
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="chat-scroll flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <p className="max-w-sm text-center text-sm text-slate-500">
              Upload a PDF, select it on the left, and ask a question.
              Answers come with clickable page citations — everything stays on
              this machine.
            </p>
          </div>
        )}
        {messages.map((msg) =>
          msg.role === "user" ? (
            <div key={msg.id} className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-slate-800 px-4 py-2.5 text-sm text-white">
                {msg.text}
              </div>
            </div>
          ) : (
            <div key={msg.id} className="flex justify-start">
              <div
                className={`max-w-[90%] rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm leading-relaxed ${
                  msg.error
                    ? "bg-red-50 text-red-700"
                    : "bg-white text-slate-800 shadow-sm"
                }`}
              >
                <div className="whitespace-pre-wrap">
                  {msg.error
                    ? msg.text
                    : renderWithCitations(msg.text, msg.citations, onCitationClick)}
                </div>
                {typeof msg.latency_ms === "number" && (
                  <p className="mt-2 text-[11px] text-slate-400">
                    Answered locally in {(msg.latency_ms / 1000).toFixed(1)}s
                  </p>
                )}
              </div>
            </div>
          )
        )}
        {asking && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-sm">
              <span className="typing-dot h-2 w-2 rounded-full bg-slate-400" />
              <span className="typing-dot h-2 w-2 rounded-full bg-slate-400" />
              <span className="typing-dot h-2 w-2 rounded-full bg-slate-400" />
              <span className="ml-2 text-xs text-slate-500">
                Apertus is reading your documents…
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-slate-200 bg-white p-4">
        {error && (
          <p className="mb-2 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
            placeholder={
              selectedDocs.length === 0
                ? "Select a document first…"
                : "Ask a question about your documents…"
            }
            disabled={asking}
            className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:bg-slate-50"
          />
          <button
            onClick={handleAsk}
            disabled={asking || !input.trim()}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {asking ? "…" : "Ask"}
          </button>
        </div>
        <p className="mt-2 text-[11px] text-slate-400">
          Asking across {selectedDocs.length} document
          {selectedDocs.length === 1 ? "" : "s"} · local inference only
        </p>
      </div>
    </div>
  );
}
