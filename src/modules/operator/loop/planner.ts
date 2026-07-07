import type { Action, DesktopState, PageState, OperationContext } from "../types.js";
import { logger } from "../../../core/logging/logger.js";

export function planNextAction(
  state: DesktopState,
  steps: Action[],
  currentStep: number,
): OperationContext {
  if (currentStep >= steps.length) {
    return {
      currentStep,
      expectedNextState: "loaded" as PageState,
      confidence: 1,
      reasoning: "All steps completed",
    };
  }

  const nextAction = steps[currentStep];
  const expectedState = inferExpectedState(nextAction, state);

  logger.debug("Next action planned", {
    step: currentStep,
    action: nextAction?.type ?? "unknown",
    description: nextAction?.description ?? "none",
    expectedState,
  });

  return {
    currentStep,
    expectedNextState: expectedState,
    confidence: 0.9,
    reasoning: `Execute step ${currentStep}: ${nextAction?.description ?? "unknown"}`,
  };
}

function inferExpectedState(action: Action | undefined, state: DesktopState): PageState {
  if (!action) return state.pageState;

  switch (action.type) {
    case "navigate_url":
      return "loading";
    case "mouse_click":
    case "ax_click":
      if (action.description.toLowerCase().includes("reply")) return "reply_dialog_open";
      if (action.description.toLowerCase().includes("submit")) return "reply_sent";
      return state.pageState;
    case "pause_human":
      return state.pageState;
    case "wait":
      return state.pageState;
    default:
      return state.pageState;
  }
}
