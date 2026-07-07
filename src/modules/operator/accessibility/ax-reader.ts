import { execSync } from "node:child_process";
import type { AXElement } from "../types.js";
import { logger } from "../../../core/logging/logger.js";

export function getAXTree(processName: string, windowTitle?: string): AXElement | null {
  try {
    const titleFilter = windowTitle
      ? `if name of w contains "${windowTitle}" then`
      : "";

    const script = `
      use framework "AppKit"
      use scripting additions

      tell application "System Events"
        tell process "${processName}"
          set frontmost to true
          ${titleFilter ? `repeat with w in (every window)\n${titleFilter}\nset targetWin to w\nexit repeat\nend if\nend repeat` : "set targetWin to front window"}

          set root to entire contents of targetWin
          set output to ""
          repeat with elem in root
            try
              set eRole to role of elem
              set eTitle to ""
              try
                set eTitle to title of elem
              end try
              set eVal to ""
              try
                set eVal to value of elem
              end try
              set ePos to position of elem
              set eSize to size of elem
              set eEnabled to enabled of elem
              set eFocused to focused of elem

              set output to output & eRole & "||" & eTitle & "||" & eVal & "||" & (item 1 of ePos) & "," & (item 2 of ePos) & "," & (item 1 of eSize) & "," & (item 2 of eSize) & "||" & eEnabled & "||" & eFocused & "\\n"
            end try
          end repeat
          return output
        end tell
      end tell
    `;

    const raw = execSync(
      `osascript -l AppleScript -e '${script.replace(/'/g, "'\\''")}'`,
      { encoding: "utf-8", timeout: 10000 },
    ).trim();

    if (!raw) return null;

    const lines = raw.split("\n").filter(Boolean);
    const elements: AXElement[] = lines.map((line) => {
      const [role, title, value, pos, enabled, focused] = line.split("||");
      const [x, y, w, h] = (pos ?? "0,0,0,0").split(",").map(Number);
      return {
        role: role ?? "",
        title: title ?? "",
        value: value ?? "",
        position: {
          x: x ?? 0,
          y: y ?? 0,
          width: w ?? 0,
          height: h ?? 0,
        },
        enabled: enabled === "true",
        focused: focused === "true",
        children: [],
      };
    });

    logger.debug("AX tree read", {
      processName,
      elementCount: elements.length,
    });

    return {
      role: "AXWindow",
      title: windowTitle ?? processName,
      value: "",
      position: { x: 0, y: 0, width: 0, height: 0 },
      enabled: true,
      focused: true,
      children: elements,
    };
  } catch (error) {
    logger.warn("Failed to read AX tree", {
      processName,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

export function findElements(
  tree: AXElement,
  role: string,
  title?: string,
): AXElement[] {
  const results: AXElement[] = [];

  function search(node: AXElement): void {
    if (node.role === role) {
      if (!title || node.title.toLowerCase().includes(title.toLowerCase())) {
        results.push(node);
      }
    }
    for (const child of node.children) {
      search(child);
    }
  }

  search(tree);
  return results;
}

export function findFirstElement(
  tree: AXElement,
  role: string,
  title?: string,
): AXElement | null {
  return findElements(tree, role, title)[0] ?? null;
}

export function elementExists(
  processName: string,
  role: string,
  title?: string,
): boolean {
  const tree = getAXTree(processName);
  if (!tree) return false;
  return findFirstElement(tree, role, title) !== null;
}

export async function clickAXElement(element: AXElement): Promise<void> {
  try {
    const { x, y, width, height } = element.position;
    const centerX = Math.round(x + width / 2);
    const centerY = Math.round(y + height / 2);

    const { moveTo, click } = await import("../desktop/mouse.js");
    moveTo(centerX, centerY);
    click();

    logger.debug("AX element clicked", {
      role: element.role,
      title: element.title,
      position: `${centerX},${centerY}`,
    });
  } catch (error) {
    logger.warn("Failed to click AX element", {
      role: element.role,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
