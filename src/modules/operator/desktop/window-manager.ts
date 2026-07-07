import { execSync } from "node:child_process";
import type { WindowInfo } from "../types.js";
import { logger } from "../../../core/logging/logger.js";

export function listWindows(): WindowInfo[] {
  try {
    const script = `
      tell application "System Events"
        set output to ""
        repeat with p in (every process whose visible is true)
          set pName to name of p
          try
            repeat with w in (every window of p)
              set wTitle to name of w
              set wPos to position of w
              set wSize to size of w
              set output to output & pName & "|" & wTitle & "|" & (item 1 of wPos) & "," & (item 2 of wPos) & "|" & (item 1 of wSize) & "x" & (item 2 of wSize) & "\\n"
            end repeat
          end try
        end repeat
        return output
      end tell
    `;
    const raw = execSync(`osascript -e '${script.replace(/'/g, "'\\''")}'`, {
      encoding: "utf-8",
      timeout: 5000,
    }).trim();

    if (!raw) return [];

    return raw.split("\n").filter(Boolean).map((line) => {
      const [process, title, pos, size] = line.split("|");
      const [x, y] = (pos ?? "0,0").split(",").map(Number);
      const [w, h] = (size ?? "0x0").split("x").map(Number);
      return {
        title: title ?? "",
        processName: process ?? "",
        pid: 0,
        position: { x: x ?? 0, y: y ?? 0 },
        size: { width: w ?? 0, height: h ?? 0 },
        isActive: false,
      };
    });
  } catch (error) {
    logger.warn("Failed to list windows", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getActiveWindow(): WindowInfo | null {
  try {
    const script = `
      tell application "System Events"
        set frontProc to first process whose frontmost is true
        set pName to name of frontProc
        try
          set w to front window of frontProc
          set wTitle to name of w
          set wPos to position of w
          set wSize to size of w
          return pName & "|" & wTitle & "|" & (item 1 of wPos) & "," & (item 2 of wPos) & "|" & (item 1 of wSize) & "x" & (item 2 of wSize)
        on error
          return pName & "||0,0|0x0"
        end try
      end tell
    `;
    const raw = execSync(`osascript -e '${script.replace(/'/g, "'\\''")}'`, {
      encoding: "utf-8",
      timeout: 5000,
    }).trim();

    const [process, title, pos, size] = raw.split("|");
    const [x, y] = (pos ?? "0,0").split(",").map(Number);
    const [w, h] = (size ?? "0x0").split("x").map(Number);

    return {
      title: title ?? "",
      processName: process ?? "",
      pid: 0,
      position: { x: x ?? 0, y: y ?? 0 },
      size: { width: w ?? 0, height: h ?? 0 },
      isActive: true,
    };
  } catch (error) {
    logger.warn("Failed to get active window", {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

export function focusWindow(processName: string, windowTitle?: string): void {
  try {
    if (windowTitle) {
      const script = `
        tell application "System Events"
          tell process "${processName}"
            set frontmost to true
            repeat with w in (every window)
              if name of w contains "${windowTitle}" then
                set index of w to 1
                exit repeat
              end if
            end repeat
          end tell
        end tell
      `;
      execSync(`osascript -e '${script.replace(/'/g, "'\\''")}'`, { timeout: 5000 });
    } else {
      execSync(`osascript -e 'tell application "System Events" to set frontmost of process "${processName}" to true'`, {
        timeout: 5000,
      });
    }
    logger.debug("Window focused", { processName, windowTitle });
  } catch (error) {
    logger.warn("Failed to focus window", {
      processName,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

export function findWindowByProcess(name: string): WindowInfo | null {
  return listWindows().find((w) => w.processName.toLowerCase().includes(name.toLowerCase())) ?? null;
}

export function findWindowByTitle(title: string): WindowInfo | null {
  return listWindows().find((w) => w.title.toLowerCase().includes(title.toLowerCase())) ?? null;
}
