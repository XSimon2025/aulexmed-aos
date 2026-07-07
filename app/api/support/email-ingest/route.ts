import { NextResponse } from "next/server";
import { analyzeSupportEmail, normalizeEmailInput } from "@/lib/support-mail/analysis";
import { isIngestRequestAuthorized } from "@/lib/support-mail/auth";
import { sendFeishuSupportNotification } from "@/lib/support-mail/feishu";
import {
  createSupportEmailCase,
  createSupportEmailEvent,
  createSupportEmailMessage,
  updateSupportEmailCaseAnalysis
} from "@/lib/support-mail/repository";
import type { SupportEmailIngestInput } from "@/lib/support-mail/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isIngestRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: SupportEmailIngestInput;

  try {
    body = (await request.json()) as SupportEmailIngestInput;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const normalized = normalizeEmailInput(body);

  if (!normalized.from_email || !normalized.clean_body) {
    return NextResponse.json({ error: "from_email and body are required." }, { status: 400 });
  }

  try {
    const emailCase = await createSupportEmailCase(normalized);

    await createSupportEmailMessage({
      case_id: emailCase.id,
      direction: "inbound",
      from_email: normalized.from_email,
      to_email: normalized.source_email,
      subject: normalized.subject,
      body: normalized.clean_body
    });

    await createSupportEmailEvent({
      case_id: emailCase.id,
      event_type: "email_ingested",
      event_payload: {
        source_email: normalized.source_email,
        attachment_count: normalized.attachments.length
      }
    });

    const { analysis, knowledgeCount, source } = await analyzeSupportEmail({
      subject: normalized.subject,
      clean_body: normalized.clean_body,
      from_email: normalized.from_email,
      source_email: normalized.source_email
    });

    const updatedCase = await updateSupportEmailCaseAnalysis(emailCase.id, analysis);

    await createSupportEmailEvent({
      case_id: emailCase.id,
      event_type: "ai_analyzed",
      event_payload: {
        source,
        knowledge_count: knowledgeCount,
        urgency: analysis.urgency,
        issue_type: analysis.issue_type
      }
    });

    const feishuResult = await sendFeishuSupportNotification({
      title: "New Email Case",
      event: "email_ingested",
      emailCase: updatedCase,
      extra: {
        "Knowledge matches": knowledgeCount
      }
    });

    await createSupportEmailEvent({
      case_id: emailCase.id,
      event_type: "feishu_notified",
      event_payload: feishuResult
    });

    return NextResponse.json({
      ok: true,
      caseId: updatedCase.id,
      analysis,
      knowledgeCount,
      feishu: feishuResult.ok ? "sent" : "skipped_or_failed"
    });
  } catch (error) {
    console.error("AULEXMED support email ingest failed", error);
    return NextResponse.json({ error: "Support email ingest failed." }, { status: 500 });
  }
}
