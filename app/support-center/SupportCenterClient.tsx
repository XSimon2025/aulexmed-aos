"use client";

import { useEffect, useMemo, useState } from "react";
import type { SupportEmailCase, SupportEmailMessage, SupportEmailStatus } from "@/lib/support-mail/types";

type CaseDetail = {
  case: SupportEmailCase;
  messages: SupportEmailMessage[];
};

const statuses: Array<SupportEmailStatus | "all"> = ["all", "new", "pending", "replied", "resolved", "ignored"];

export function SupportCenterClient({ initialCaseId }: { initialCaseId?: string }) {
  const [cases, setCases] = useState<SupportEmailCase[]>([]);
  const [selectedId, setSelectedId] = useState(initialCaseId || "");
  const [detail, setDetail] = useState<CaseDetail | null>(null);
  const [status, setStatus] = useState<SupportEmailStatus | "all">("all");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const selectedCase = useMemo(() => detail?.case || cases.find((item) => item.id === selectedId), [cases, detail, selectedId]);

  async function loadCases(nextStatus = status) {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`/api/support/cases?status=${nextStatus}`, { cache: "no-store" });
      const data = (await response.json()) as { cases?: SupportEmailCase[]; error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Failed to load cases.");
      }

      setCases(data.cases || []);
      if (!selectedId && data.cases?.[0]) {
        setSelectedId(data.cases[0].id);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to load cases.");
    } finally {
      setLoading(false);
    }
  }

  async function loadCase(caseId: string) {
    if (!caseId) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`/api/support/cases/${caseId}`, { cache: "no-store" });
      const data = (await response.json()) as CaseDetail & { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Failed to load case.");
      }

      setDetail(data);
      setReply(data.case.ai_reply_draft || "");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to load case.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(nextStatus: SupportEmailStatus) {
    if (!selectedCase) {
      return;
    }

    const response = await fetch(`/api/support/cases/${selectedCase.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus })
    });

    const data = (await response.json()) as { case?: SupportEmailCase; error?: string };
    if (!response.ok) {
      setMessage(data.error || "Failed to update status.");
      return;
    }

    setDetail((current) => (current && data.case ? { ...current, case: data.case } : current));
    await loadCases(status);
  }

  async function sendReply() {
    if (!selectedCase || !reply.trim()) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`/api/support/cases/${selectedCase.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: `Re: ${selectedCase.subject}`,
          body: reply,
          sent_by: "AULEXMED Support Center"
        })
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Failed to send reply.");
      }

      setMessage("Reply sent.");
      await loadCase(selectedCase.id);
      await loadCases(status);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to send reply.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCases(status);
  }, []);

  useEffect(() => {
    if (selectedId) {
      loadCase(selectedId);
    }
  }, [selectedId]);

  return (
    <section className="bg-slate-50 py-10">
      <div className="container-page">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Internal Support</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-brand-navy sm:text-4xl">AULEXMED AI Mail Support Center</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Email cases are analyzed with the AULEXMED knowledge base first, then prepared for human review.
            </p>
          </div>
          <select
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-brand-navy shadow-sm"
            value={status}
            onChange={(event) => {
              const nextStatus = event.target.value as SupportEmailStatus | "all";
              setStatus(nextStatus);
              loadCases(nextStatus);
            }}
          >
            {statuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {message ? <div className="mb-5 rounded-2xl border border-sky-100 bg-white px-5 py-4 text-sm text-brand-navy shadow-sm">{message}</div> : null}

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <aside className="rounded-[2rem] border border-slate-200 bg-white p-3 shadow-sm">
            <div className="max-h-[720px] space-y-2 overflow-auto pr-1">
              {cases.map((item) => (
                <button
                  key={item.id}
                  className={`w-full rounded-[1.5rem] border px-4 py-4 text-left transition ${
                    selectedId === item.id
                      ? "border-brand-blue bg-sky-50"
                      : "border-transparent bg-white hover:border-slate-200 hover:bg-slate-50"
                  }`}
                  onClick={() => setSelectedId(item.id)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-blue">{item.urgency}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{item.status}</span>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm font-semibold text-brand-navy">{item.subject}</p>
                  <p className="mt-2 truncate text-xs text-slate-500">{item.from_email}</p>
                </button>
              ))}
              {!cases.length ? <p className="px-4 py-8 text-sm text-slate-500">{loading ? "Loading cases..." : "No cases found."}</p> : null}
            </div>
          </aside>

          <main className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            {!selectedCase ? (
              <p className="text-sm text-slate-500">Select a case to review.</p>
            ) : (
              <div className="space-y-8">
                <div className="border-b border-slate-100 pb-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-brand-blue">
                      {selectedCase.issue_type || "support"}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{selectedCase.status}</span>
                  </div>
                  <h2 className="mt-4 text-2xl font-semibold tracking-tight text-brand-navy">{selectedCase.subject}</h2>
                  <p className="mt-2 text-sm text-slate-500">
                    {selectedCase.from_email} to {selectedCase.source_email}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    ["Platform", selectedCase.platform],
                    ["Product", selectedCase.product_model || selectedCase.product_category],
                    ["Country", selectedCase.detected_country],
                    ["Language", selectedCase.language]
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</p>
                      <p className="mt-2 text-sm font-semibold text-brand-navy">{value || "Not detected"}</p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  <section>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-blue">AI Summary</h3>
                    <p className="mt-3 whitespace-pre-wrap rounded-2xl bg-slate-50 p-5 text-sm leading-6 text-slate-700">
                      {selectedCase.summary || "No summary available."}
                    </p>
                  </section>
                  <section>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-blue">Recommended Action</h3>
                    <p className="mt-3 whitespace-pre-wrap rounded-2xl bg-slate-50 p-5 text-sm leading-6 text-slate-700">
                      {selectedCase.ai_recommendation || "No recommendation available."}
                    </p>
                  </section>
                </div>

                <section>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-blue">Reply Draft</h3>
                  <textarea
                    className="mt-3 min-h-56 w-full rounded-3xl border border-slate-200 bg-white p-5 text-sm leading-6 text-brand-navy outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-sky-100"
                    value={reply}
                    onChange={(event) => setReply(event.target.value)}
                  />
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button className="btn-premium btn-premium-primary" disabled={loading} onClick={sendReply}>
                      Send Reply
                    </button>
                    {(["pending", "resolved", "ignored"] as SupportEmailStatus[]).map((item) => (
                      <button key={item} className="btn-premium btn-premium-secondary" onClick={() => updateStatus(item)}>
                        Mark {item}
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-blue">Conversation</h3>
                  <div className="mt-3 space-y-3">
                    {detail?.messages.map((item) => (
                      <div key={item.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                          <span>{item.direction}</span>
                          <span>{new Date(item.created_at).toLocaleString()}</span>
                        </div>
                        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">{item.body}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}
