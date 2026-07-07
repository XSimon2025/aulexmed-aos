import { findWindowByProcess } from "../desktop/window-manager.js";
import { wait } from "../desktop/wait.js";
import { logger } from "../../../core/logging/logger.js";

const ZINIAO_PROCESS = "ziniaobrowser";

export async function ensureZiniaoFocused(): Promise<void> {
  const existing = findWindowByProcess(ZINIAO_PROCESS);
  if (!existing) {
    logger.warn("Ziniao browser not found");
    return;
  }
  const { focusWindow } = await import("../desktop/window-manager.js");
  focusWindow(ZINIAO_PROCESS);
  await wait(500);
}

export async function getZiniaoState() {
  const window = findWindowByProcess(ZINIAO_PROCESS);

  return {
    found: window !== null,
    title: window?.title ?? "",
    position: window?.position ?? { x: 0, y: 0 },
    size: window?.size ?? { width: 0, height: 0 },
  };
}

export async function isPageLoaded(): Promise<boolean> {
  const window = findWindowByProcess(ZINIAO_PROCESS);
  if (!window) return false;
  return !window.title.toLowerCase().includes("loading");
}
