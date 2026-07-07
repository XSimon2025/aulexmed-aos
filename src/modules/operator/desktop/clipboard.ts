import { execSync } from "node:child_process";

export function copyToClipboard(text: string): void {
  const escaped = text.replace(/"/g, '\\"').replace(/`/g, "\\`").replace(/\$/g, "\\$");
  execSync(`printf '%s' "${escaped}" | pbcopy`, { timeout: 5000 });
}

export function readClipboard(): string {
  try {
    return execSync("pbpaste", { encoding: "utf-8", timeout: 5000 }).trim();
  } catch {
    return "";
  }
}

export function clearClipboard(): void {
  execSync("pbcopy < /dev/null", { timeout: 5000 });
}
