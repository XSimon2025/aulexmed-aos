import { NextResponse } from "next/server";
import { isSupportApiRequestAuthorized } from "@/lib/support-mail/auth";
import {
  createSupportEmailEvent,
  getSupportEmailCase,
  listSupportEmailMessages,
  updateSupportEmailCaseStatus
} from "@/lib/support-mail/repository";
import type { SupportEmailStatus } from "@/lib/support-mail/types";

export const runtime = "nodejs";

const statuses = new Set(["new", "pending", "replied", "resolved", "ignored"]);

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSupportApiRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;

  try {
    const emailCase = await getSupportEmailCase(id);

    if (!emailCase) {
      return NextResponse.json({ error: "Support case not found." }, { status: 404 });
    }

    const messages = await listSupportEmailMessages(id);

    return NextResponse.json({ case: emailCase, messages });
  } catch (error) {
    console.error("AULEXMED support case load failed", error);
    return NextResponse.json({ error: "Failed to load support case." }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSupportApiRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: { status?: SupportEmailStatus };

  try {
    body = (await request.json()) as { status?: SupportEmailStatus };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.status || !statuses.has(body.status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const { id } = await params;

  try {
    const emailCase = await updateSupportEmailCaseStatus(id, body.status);

    await createSupportEmailEvent({
      case_id: id,
      event_type: "status_updated",
      event_payload: {
        status: body.status
      }
    });

    return NextResponse.json({ case: emailCase });
  } catch (error) {
    console.error("AULEXMED support case status update failed", error);
    return NextResponse.json({ error: "Failed to update support case." }, { status: 500 });
  }
}
