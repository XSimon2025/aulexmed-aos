import { execSync } from "node:child_process";

function runCliclick(cmd: string): string {
  return execSync(`cliclick ${cmd}`, { encoding: "utf-8", timeout: 5000 }).trim();
}

export function getPosition(): { x: number; y: number } | null {
  const raw = runCliclick("p");
  if (!raw) return null;
  const [x, y] = raw.split(",").map(Number);
  if (x === undefined || y === undefined || Number.isNaN(x) || Number.isNaN(y)) return null;
  return { x, y };
}

export function moveTo(x: number, y: number): void {
  runCliclick(`m:${Math.round(x)},${Math.round(y)}`);
}

export function moveRelative(dx: number, dy: number): void {
  runCliclick(`m:+${Math.round(dx)},+${Math.round(dy)}`);
}

export function click(): void {
  runCliclick("c:.");
}

export function clickAt(x: number, y: number): void {
  moveTo(x, y);
  click();
}

export function doubleClick(): void {
  runCliclick("dc:.");
}

export function rightClick(): void {
  runCliclick("rc:.");
}

export function scroll(direction: "up" | "down", amount = 3): void {
  runCliclick(direction === "up" ? `wup:${amount}` : `wdown:${amount}`);
}
