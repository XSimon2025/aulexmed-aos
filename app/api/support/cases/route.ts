import { NextResponse } from "next/server";
import { isSupportApiRequestAuthorized } from "@/lib/support-mail/auth";
import { listSupportEmailCases } from "@/lib/support-mail/repository";
import type { SupportEmailStatus } from "@/lib/support-mail/types";

export const runtime = "nodejs";

const statuses = new Set(["all", "new", "pending", "replied", "resolved", "ignored"]);

export async function GET(request: Request) {
  if (!isSupportApiRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const url = new URL(request.url);
  const status = url.searchParams.get("status") || "all";

  if (!statuses.has(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  try {
    const cases = await listSupportEmailCases({
      status: status as SupportEmailStatus | "all",
      limit: Number(url.searchParams.get("limit") || 50)
    });

    return NextResponse.json({ cases });
  } catch (error) {
    console.error("AULEXMED support case list failed", error);
    return NextResponse.json({ error: "Failed to load support cases." }, { status: 500 });
  }
}
