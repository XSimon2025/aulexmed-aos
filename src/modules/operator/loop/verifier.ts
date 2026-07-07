import type { DesktopState, PageState, ActionResult } from "../types.js";
import { observe } from "./observer.js";
import { logger } from "../../../core/logging/logger.js";

export interface VerificationResult {
  success: boolean;
  stateChanged: boolean;
  currentState: PageState;
  expectedState: PageState;
  details: string;
}

export async function verifyStep(
  result: ActionResult,
  expectedState: PageState,
): Promise<VerificationResult> {
  if (!result.success) {
    return {
      success: false,
      stateChanged: false,
      currentState: "unknown",
      expectedState,
      details: result.error ?? "Action failed",
    };
  }

  const newState: DesktopState = await observe();
  const stateChanged = newState.pageState === expectedState;

  logger.debug("Step verification", {
    expected: expectedState,
    actual: newState.pageState,
    changed: stateChanged,
  });

  return {
    success: stateChanged || newState.pageState !== "unknown",
    stateChanged,
    currentState: newState.pageState,
    expectedState,
    details: stateChanged
      ? `State changed to ${newState.pageState} as expected`
      : `Expected ${expectedState}, got ${newState.pageState}`,
  };
}
