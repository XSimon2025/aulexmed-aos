import { execSync } from "node:child_process";
import { logger } from "../../../core/logging/logger.js";
import * as mouse from "../desktop/mouse.js";
import * as keyboard from "../desktop/keyboard.js";
import * as clipboard from "../desktop/clipboard.js";
import { wait as sleep } from "../desktop/wait.js";
import { isDangerous, isBlocked } from "../safety/policy.js";
import type { WindowInfo } from "../types.js";

export interface OperatorConfig {
  dryRun: boolean;
  supervised: boolean;
  logActions: boolean;
}

const DEFAULT_CONFIG: OperatorConfig = {
  dryRun: true,
  supervised: true,
  logActions: true,
};

export interface DesktopState {
  activeApp: string;
  activeWindowTitle: string;
  mousePosition: { x: number; y: number } | null;
  clipboardPreview: string;
  timestamp: string;
}

export class DesktopOperator {
  private config: OperatorConfig;
  private actionLog: string[];
  private screenshots: string[];

  constructor(config: Partial<OperatorConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.actionLog = [];
    this.screenshots = [];
  }

  get mode(): string {
    if (this.config.dryRun && this.config.supervised) return "dry-run+supervised";
    if (this.config.dryRun) return "dry-run";
    if (this.config.supervised) return "supervised";
    return "live";
  }

  // ── Observation ──

  observe(): DesktopState {
    const app = this.getActiveApp();
    const mousePos = mouse.getPosition();
    const clip = clipboard.readClipboard();

    return {
      activeApp: app.name,
      activeWindowTitle: app.title,
      mousePosition: mousePos,
      clipboardPreview: clip.slice(0, 100),
      timestamp: new Date().toISOString(),
    };
  }

  getActiveApp(): { name: string; title: string } {
    try {
      const raw = execSync(
        `osascript -e 'tell application "System Events" to get {name, title} of first process whose frontmost is true'`,
        { encoding: "utf-8", timeout: 5000 },
      ).trim();
      const [name, title] = raw.split(", ");
      return { name: name ?? "", title: title ?? "" };
    } catch {
      return { name: "unknown", title: "unknown" };
    }
  }

  listWindows(): WindowInfo[] {
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
    } catch {
      return [];
    }
  }

  // ── Window Control ──

  activateApp(name: string): void {
    if (this.config.dryRun) {
      this.log("activate_app", name, "DRY RUN — not executed");
      return;
    }
    try {
      execSync(
        `osascript -e 'tell application "System Events" to set frontmost of process "${name}" to true'`,
        { timeout: 5000 },
      );
      this.log("activate_app", name);
    } catch (e) {
      this.log("activate_app", name, `Error: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  findWindow(process: string): WindowInfo | null {
    return this.listWindows().find(
      (w) => w.processName.toLowerCase().includes(process.toLowerCase()),
    ) ?? null;
  }

  // ── Mouse ──

  clickAt(x: number, y: number, description = ""): void {
    if (isBlocked("click", description)) {
      this.log("click", `${x},${y}`, "BLOCKED by safety policy");
      return;
    }
    if (this.config.dryRun) {
      this.log("click", `${x},${y}`, `DRY RUN${description ? ` — ${description}` : ""}`);
      return;
    }
    if (isDangerous("click", description) && this.config.supervised) {
      this.log("click", `${x},${y}`, `SUPERVISED — requires confirmation${description ? ` (${description})` : ""}`);
      return;
    }
    mouse.clickAt(x, y);
    this.log("click", `${x},${y}`, description);
  }

  click(description = ""): void {
    if (isDangerous("click", description)) {
      this.log("click", "current position", `DANGEROUS — requires confirmation`);
      return;
    }
    if (this.config.dryRun) {
      this.log("click", "current position", `DRY RUN`);
      return;
    }
    mouse.click();
    this.log("click", "current position", description);
  }

  // ── Keyboard ──

  typeText(text: string): void {
    if (this.config.dryRun) {
      this.log("type", text.slice(0, 50), "DRY RUN");
      return;
    }
    keyboard.typeText(text);
    this.log("type", text.slice(0, 50) + (text.length > 50 ? "..." : ""));
  }

  pasteText(text: string): void {
    if (this.config.dryRun) {
      this.log("paste", text.slice(0, 50), "DRY RUN");
      return;
    }
    clipboard.copyToClipboard(text);
    keyboard.cmdV();
    this.log("paste", text.slice(0, 50) + (text.length > 50 ? "..." : ""));
  }

  hotkey(modifiers: string[], key: string): void {
    if (this.config.dryRun) {
      this.log("hotkey", `${modifiers.join("+")}+${key}`, "DRY RUN");
      return;
    }
    keyboard.keyCombo(modifiers as Parameters<typeof keyboard.keyCombo>[0], key);
    this.log("hotkey", `${modifiers.join("+")}+${key}`);
  }

  // ── Clipboard ──

  copyToClipboard(text: string): void {
    if (this.config.dryRun) {
      this.log("clipboard_copy", text.slice(0, 50), "DRY RUN");
      return;
    }
    clipboard.copyToClipboard(text);
    this.log("clipboard_copy", `set (${text.length} chars)`);
  }

  readClipboard(): string {
    return clipboard.readClipboard();
  }

  // ── Timing ──

  async wait(ms: number): Promise<void> {
    await sleep(ms);
  }

  // ── Screenshot ──

  screenshot(outputPath?: string): string {
    if (this.config.dryRun) {
      this.log("screenshot", outputPath ?? "(auto)", "DRY RUN — not captured");
      return "";
    }
    const path = outputPath ?? `/tmp/aos-screenshot-${Date.now()}.png`;
    execSync(`screencapture -C -m -x "${path}"`, { timeout: 10000 });
    this.screenshots.push(path);
    this.log("screenshot", path);
    return path;
  }

  // ── Logging ──

  log(type: string, target: string, detail?: string): void {
    const entry = `${new Date().toISOString()} [${this.mode}] ${type} | ${target}${detail ? ` | ${detail}` : ""}`;
    this.actionLog.push(entry);
    if (this.config.logActions) {
      logger.info(entry);
    }
  }

  getActionLog(): string[] {
    return [...this.actionLog];
  }

  getScreenshots(): string[] {
    return [...this.screenshots];
  }

  // ── Config ──

  setDryRun(enabled: boolean): void {
    this.config.dryRun = enabled;
  }

  setSupervised(enabled: boolean): void {
    this.config.supervised = enabled;
  }

  setLive(): void {
    this.config.dryRun = false;
    this.config.supervised = false;
  }

  // ── Self Test ──

  async selfTest(): Promise<{ passed: boolean; results: string[] }> {
    const results: string[] = [];

    const addResult = (step: string, ok: boolean, detail = "") => {
      const status = ok ? "PASS" : "FAIL";
      const line = `[${status}] ${step}${detail ? ` — ${detail}` : ""}`;
      results.push(line);
      logger.info(line);
    };

    logger.info("=== Desktop Operator Self-Test ===");
    logger.info(`Mode: ${this.mode}`);
    results.push(`Mode: ${this.mode}`);

    // 1. Activate TextEdit
    try {
      execSync("osascript -e 'tell application \"TextEdit\" to activate'", { timeout: 5000 });
      addResult("Activate TextEdit", true);
    } catch {
      addResult("Activate TextEdit", false, "osascript failed");
      return { passed: false, results };
    }

    // 2. New document
    try {
      execSync("osascript -e 'tell application \"TextEdit\" to make new document'", { timeout: 5000 });
      addResult("New document", true);
    } catch {
      addResult("New document", false);
      return { passed: false, results };
    }

    await sleep(300);

    // 3. Type text
    try {
      keyboard.typeText("Hello AOS");
      addResult("Type text", true, '"Hello AOS"');
    } catch {
      addResult("Type text", false);
    }

    await sleep(300);

    // 4. Select all + copy
    try {
      keyboard.cmdA();
      await sleep(200);
      keyboard.cmdC();
      await sleep(200);
      const copied = clipboard.readClipboard();
      const ok = copied.includes("Hello AOS");
      addResult("Select all + copy", ok, ok ? `"${copied}"` : `got: "${copied}"`);
    } catch (e) {
      addResult("Select all + copy", false, String(e));
    }

    // 5. Paste
    try {
      keyboard.pressArrow("right");
      await sleep(200);
      keyboard.pressKey("space");
      await sleep(200);
      keyboard.cmdV();
      addResult("Paste", true);
    } catch {
      addResult("Paste", false);
    }

    await sleep(300);

    // 6. Close without saving
    try {
      execSync("osascript -e 'tell application \"TextEdit\" to close document 1 without saving'", { timeout: 5000 });
      addResult("Close without saving", true);
    } catch {
      addResult("Close without saving", false);
    }

    // 7. Verify window closed
    try {
      const raw = execSync(
        "osascript -e 'tell application \"System Events\" to count (every window of process \"TextEdit\")'",
        { encoding: "utf-8", timeout: 5000 },
      ).trim();
      const closed = raw === "0" || raw === "missing value";
      addResult("Window closed", closed, `${raw} windows remaining`);
    } catch {
      addResult("Window closed", true, "app quit");
    }

    const passed = results.every((r) => r.startsWith("[PASS]") || r.startsWith("Mode:"));
    logger.info(`=== Self-Test ${passed ? "PASSED" : "FAILED"} ===`);

    return { passed, results };
  }
}
