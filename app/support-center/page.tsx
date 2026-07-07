import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createSupportSessionToken,
  getSupportCookieName,
  isSupportCenterSessionValid,
  verifySupportPassword
} from "@/lib/support-mail/auth";
import { SupportCenterClient } from "./SupportCenterClient";

export const metadata: Metadata = {
  title: "AI Mail Support Center",
  robots: {
    index: false,
    follow: false
  }
};

function LoginPanel() {
  return (
    <section className="bg-slate-50 py-16">
      <div className="container-page flex min-h-[58vh] items-center justify-center">
        <form
          className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm"
          action={async (formData) => {
            "use server";
            const password = String(formData.get("password") || "");

            if (verifySupportPassword(password)) {
              const cookieStore = await cookies();
              cookieStore.set(getSupportCookieName(), createSupportSessionToken(password), {
                httpOnly: true,
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
                path: "/",
                maxAge: 60 * 60 * 12
              });
              redirect("/support-center");
            }
          }}
        >
          <p className="eyebrow">Internal Access</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-brand-navy">AULEXMED Support Center</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Enter the internal password to review AI-analyzed email cases.
          </p>
          <input
            name="password"
            type="password"
            required
            className="mt-6 w-full rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-brand-navy outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-sky-100"
            placeholder="Support center password"
          />
          <button className="btn-premium btn-premium-primary mt-5 w-full" type="submit">
            Open Support Center
          </button>
        </form>
      </div>
    </section>
  );
}

export default async function SupportCenterPage({
  searchParams
}: {
  searchParams: Promise<{ case?: string }>;
}) {
  const isValid = await isSupportCenterSessionValid();

  if (!isValid) {
    return <LoginPanel />;
  }

  const params = await searchParams;
  return <SupportCenterClient initialCaseId={params.case} />;
}
