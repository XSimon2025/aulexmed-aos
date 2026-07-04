"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
};

type ChatResponse = {
  answer: string;
  sessionId?: string;
  source: "supabase_deepseek" | "supabase_template" | "fallback";
  humanFollowUpRequired: boolean;
};

const quickQuestions = [
  "How do I choose the right size?",
  "How do I wear my product?",
  "I need help with my order.",
  "I want to request warranty support.",
  "I want to contact AULEXMED support."
];

const welcomeMessage: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi, I'm the AULEXMED support assistant. I can help with product usage, sizing, manuals, warranty, replacement parts, order support, and contacting our team."
};

function createMessage(role: ChatMessage["role"], content: string): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    role,
    content
  };
}

export function SupportChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedSessionId = window.localStorage.getItem("aulexmed_chat_session_id") || undefined;
    setSessionId(storedSessionId);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  async function sendMessage(message: string) {
    const trimmed = message.trim();

    if (!trimmed || isLoading) {
      return;
    }

    setError(null);
    setInput("");
    setMessages((current) => [...current, createMessage("user", trimmed)]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: trimmed,
          sessionId,
          pageUrl: window.location.href
        })
      });

      if (!response.ok) {
        throw new Error("Chat request failed.");
      }

      const data = (await response.json()) as ChatResponse;

      if (data.sessionId) {
        setSessionId(data.sessionId);
        window.localStorage.setItem("aulexmed_chat_session_id", data.sessionId);
      }

      setMessages((current) => [...current, createMessage("assistant", data.answer)]);
    } catch {
      setError("Sorry, the support assistant is temporarily unavailable. Please contact support@aulexmed.com.");
      setMessages((current) => [
        ...current,
        createMessage("assistant", "Sorry, I could not complete that request right now. Please contact support@aulexmed.com for help.")
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  return (
    <div className="fixed bottom-5 right-4 z-[60] sm:bottom-6 sm:right-6">
      {isOpen ? (
        <section className="mb-4 flex h-[min(680px,calc(100vh-7rem))] w-[calc(100vw-2rem)] max-w-[420px] flex-col overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white shadow-[0_28px_90px_rgba(15,55,90,0.22)]">
          <header className="border-b border-slate-200 bg-white px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase text-brand-blue">AULEXMED Support</p>
                <h2 className="mt-1 text-base font-semibold text-brand-navy">After-sales assistant</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:border-brand-blue hover:text-brand-blue"
                aria-label="Close support chat"
              >
                Close
              </button>
            </div>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 px-4 py-5">
            {messages.map((message) => (
              <div key={message.id} className={message.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={
                    message.role === "user"
                      ? "max-w-[86%] rounded-3xl bg-brand-blue px-4 py-3 text-sm leading-6 text-white"
                      : "max-w-[86%] rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-[0_10px_30px_rgba(15,55,90,0.05)]"
                  }
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isLoading ? (
              <div className="flex justify-start">
                <div className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
                  Checking AULEXMED support knowledge...
                </div>
              </div>
            ) : null}
            <div ref={endRef} />
          </div>

          <div className="border-t border-slate-200 bg-white p-4">
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {quickQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => void sendMessage(question)}
                  className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-brand-blue hover:text-brand-blue"
                >
                  {question}
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                className="min-w-0 flex-1 rounded-full border border-slate-200 px-4 py-3 text-sm text-brand-navy outline-none transition placeholder:text-slate-400 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10"
                placeholder="Ask about sizing, manuals, orders..."
                aria-label="Ask AULEXMED support"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="rounded-full bg-brand-blue px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-navy disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Send
              </button>
            </form>
            {error ? <p className="mt-2 text-xs leading-5 text-red-600">{error}</p> : null}
          </div>
        </section>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex h-14 min-w-14 items-center justify-center rounded-full bg-brand-navy px-5 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(15,55,90,0.24)] transition hover:-translate-y-0.5 hover:bg-brand-blue"
        aria-label="Open AULEXMED support chat"
      >
        {isOpen ? "Chat" : "Support"}
      </button>
    </div>
  );
}
