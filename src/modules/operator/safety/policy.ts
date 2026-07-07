export interface ActionResult {
  type: string;
  target: string;
  success: boolean;
  detail?: string;
}

export type SafetyLevel = "safe" | "dangerous" | "blocked";

const DANGEROUS_PATTERNS = [
  "send",
  "submit",
  "refund",
  "compensation",
  "delete",
  "remove",
  "order",
  "payment",
  "private_message",
  "publish",
  "confirm",
  "approve",
];

const BLOCKED_PATTERNS = [
  "refund",
  "compensation",
  "change_order",
  "cancel_order",
  "delete_review",
  "account_settings",
  "billing",
  "payment_method",
];

export function classifyAction(type: string, target: string): SafetyLevel {
  const combined = `${type} ${target}`.toLowerCase();

  for (const pattern of BLOCKED_PATTERNS) {
    if (combined.includes(pattern)) return "blocked";
  }

  for (const pattern of DANGEROUS_PATTERNS) {
    if (combined.includes(pattern)) return "dangerous";
  }

  return "safe";
}

export function isBlocked(type: string, target: string): boolean {
  return classifyAction(type, target) === "blocked";
}

export function isDangerous(type: string, target: string): boolean {
  const level = classifyAction(type, target);
  return level === "dangerous" || level === "blocked";
}
