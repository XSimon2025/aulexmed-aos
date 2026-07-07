import { execSync } from "node:child_process";

export async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function sleep(ms: number): void {
  execSync(`sleep ${(ms / 1000).toFixed(3)}`, { timeout: ms + 1000 });
}
