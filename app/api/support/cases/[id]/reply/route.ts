import { NextResponse } from "next/server";
import { sendSupportCaseReplyEmail } from "@/lib/email";
import { isSupportApiRequestAuthorized } from "@/lib/support-mail/auth";
import { sendFeishuSupportNotification } from "@/lib/support-mail/feishu";
import {
  createSupportEmailEvent,
  createSupportEmailMessage,
  getSupportEmailCase,
  updateSupportEmailCaseStatus
} from "@/lib/support-mail/repository";

export const runtime = "nodejs";

function chooseReplyChannel(emailCase: Awaited<ReturnType<typeof getSupportEmailCase>>) {
  const value = [
    emailCase?.source_email,
    emailCase?.issue_type,
    emailCase?.subject,
    emailCase?.summary,
    emailCase?.summary_en
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (/\b(b2b|business|wholesale|oem|odm|distributor|quote|quotation|private label|factory)\b/.test(value)) {
    return "business" as const;
  }

  return "support" as const;
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSupportApiRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: { body?: string; subject?: string; sent_by?: string };

  try {
    body = (await request.json()) as { body?: string; subject?: string; sent_by?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const replyBody = body.body?.trim();

  if (!replyBody) {
    return NextResponse.json({ error: "Reply body is required." }, { status: 400 });
  }

  const { id } = await params;

  try {
    const emailCase = await getSupportEmailCase(id);

    if (!emailCase) {
      return NextResponse.json({ error: "Support case not found." }, { status: 404 });
    }

    const channel = chooseReplyChannel(emailCase);
    const subject = body.subject?.trim() || `Re: ${emailCase.subject}`;
    const sendResult = await sendSupportCaseReplyEmail({
      to: emailCase.from_email,
      subject,
      body: replyBody,
      channel
    });

    if (!sendResult.ok) {
      await createSupportEmailEvent({
        case_id: id,
        event_type: "reply_send_failed",
        event_payload: sendResult
      });

      return NextResponse.json({ error: sendResult.error }, { status: 502 });
    }

    await createSupportEmailMessage({
      case_id: id,
      direction: "outbound",
      from_email: channel === "business" ? process.env.BUSINESS_EMAIL || "business@aulexmed.com" : process.env.SUPPORT_EMAIL || "support@aulexmed.com",
      to_email: emailCase.from_email,
      subject,
      body: replyBody,
      sent_by: body.sent_by || "AULEXMED Support Center",
      resend_message_id: sendResult.id
    });

    const updatedCase = await updateSupportEmailCaseStatus(id, "replied");

    await createSupportEmailEvent({
      case_id: id,
      event_type: "reply_sent",
      event_payload: {
        channel,
        resend_message_id: sendResult.id
      }
    });

    await sendFeishuSupportNotification({
      title: "Reply Sent",
      event: "reply_sent",
      emailCase: updatedCase,
      extra: {
        "Reply channel": channel,
        "Resend ID": sendResult.id
      }
    });

    return NextResponse.json({ ok: true, case: updatedCase, resendMessageId: sendResult.id });
  } catch (error) {
    console.error("AULEXMED support reply failed", error);
    return NextResponse.json({ error: "Failed to send support reply." }, { status: 500 });
  }
}
