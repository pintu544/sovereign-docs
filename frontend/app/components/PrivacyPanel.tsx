"use client";

import type { PrivacyInfo } from "../lib/api";

export default function PrivacyPanel({
  privacy,
  loading,
}: {
  privacy: PrivacyInfo | null;
  loading: boolean;
}) {
  const isPrivate = privacy !== null && privacy.external_requests === 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2">
        <span
          className={`inline-block h-3 w-3 rounded-full ${
            isPrivate ? "bg-emerald-500" : "bg-amber-400"
          }`}
          aria-hidden
        />
        <h2 className="text-sm font-semibold text-slate-800">
          {loading
            ? "Checking privacy…"
            : isPrivate
              ? "OFFLINE · PRIVATE"
              : "PRIVACY UNKNOWN"}
        </h2>
      </div>
      {privacy && (
        <dl className="mt-3 space-y-1.5 text-xs text-slate-600">
          <div className="flex justify-between">
            <dt>Model</dt>
            <dd className="font-mono font-medium text-slate-800">
              {privacy.model}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt>Inference</dt>
            <dd className="font-mono font-medium text-slate-800">
              {privacy.inference}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt>External requests</dt>
            <dd
              className={`font-mono font-bold ${
                privacy.external_requests === 0
                  ? "text-emerald-600"
                  : "text-red-600"
              }`}
            >
              {privacy.external_requests}
            </dd>
          </div>
        </dl>
      )}
      <p className="mt-3 border-t border-slate-100 pt-2 text-[11px] leading-relaxed text-slate-500">
        All inference runs on this machine. Verify in DevTools: the Network tab
        shows zero external requests while you chat.
      </p>
    </div>
  );
}
