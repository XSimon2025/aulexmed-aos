import type { DesktopState, PageState } from "../types.js";
import { getActiveWindow, listWindows } from "../desktop/window-manager.js";
import { readClipboard } from "../desktop/clipboard.js";
import { getAXTree } from "../accessibility/ax-reader.js";
import { logger } from "../../../core/logging/logger.js";

export async function observe(): Promise<DesktopState> {
  const [activeWindow, allWindows, clipboardContent] = await Promise.all([
    Promise.resolve(getActiveWindow()),
    Promise.resolve(listWindows()),
    Promise.resolve(readClipboard()),
  ]);

  const pageState = inferPageState(activeWindow);

  logger.debug("Desktop state observed", {
    activeWindow: activeWindow?.title ?? "none",
    windowCount: allWindows.length,
    pageState,
  });

  return {
    activeWindow,
    allWindows,
    clipboardContent,
    pageState,
    screenshotBase64: null,
    timestamp: new Date().toISOString(),
  };
}

function inferPageState(window: { title: string } | null): PageState {
  if (!window) return "unknown";
  const title = window.title.toLowerCase();

  if (title.includes("login") || title.includes("sign in")) return "login_required";
  if (title.includes("review") && title.includes("tiktok")) return "reviews_list";
  if (title.includes("reply") && title.includes("tiktok")) return "reply_dialog_open";

  return "loaded";
}

export async function observeWithAX(processName: string): Promise<DesktopState & { axTree: unknown }> {
  const state = await observe();
  const axTree = getAXTree(processName);
  return { ...state, axTree };
}

export { getActiveWindow, listWindows } from "../desktop/window-manager.js";
