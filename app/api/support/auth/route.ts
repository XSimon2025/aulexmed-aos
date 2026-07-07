import { NextResponse } from "next/server";
import {
  createSupportSessionToken,
  getSupportCookieName,
  verifySupportPassword
} from "@/lib/support-mail/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { password?: string };

  try {
    body = (await request.json()) as { password?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const password = body.password || "";

  if (!verifySupportPassword(password)) {
    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(getSupportCookieName(), createSupportSessionToken(password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(getSupportCookieName());
  return response;
}
