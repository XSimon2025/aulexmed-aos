import type { ReviewAnalysis } from "../types.js";

export interface StageActionPlan {
  stage: number;
  safe_to_auto_send_public_reply: boolean;
  safe_to_auto_send_private_message: boolean;
  dangerous_actions_blocked: string[];
  message_rule: string;
}

export function getStageActionPlan(stage: number = 1): StageActionPlan {
  if (stage === 1) {
    return {
      stage: 1,
      safe_to_auto_send_public_reply: false,
      safe_to_auto_send_private_message: false,
      dangerous_actions_blocked: [
        "refund",
        "compensation",
        "order_edit",
        "automatic_private_message_send",
      ],
      message_rule:
        "Stage 1: ALL replies require human review. Drafts are generated but NEVER auto-sent. No refunds, no compensation, no order edits, no private messages auto-sent.",
    };
  }

  return {
    stage,
    safe_to_auto_send_public_reply: false,
    safe_to_auto_send_private_message: false,
    dangerous_actions_blocked: [],
    message_rule: `Stage ${stage}: safety policy not yet defined.`,
  };
}

export function isActionBlocked(action: string, plan: StageActionPlan): boolean {
  return plan.dangerous_actions_blocked.includes(action);
}

export function shouldCreateMessages(analysis: ReviewAnalysis): {
  public: boolean;
  private: boolean;
} {
  return {
    public: Boolean(analysis.reply_draft_cn || analysis.reply_draft_en),
    private: Boolean(analysis.private_reply_draft),
  };
}
