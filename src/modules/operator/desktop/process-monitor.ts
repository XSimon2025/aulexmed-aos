import { execSync } from "node:child_process";
import type { ProcessInfo } from "../types.js";
import { logger } from "../../../core/logging/logger.js";

export function listProcesses(): ProcessInfo[] {
  try {
    const raw = execSync("ps axo pid,comm,%cpu,%mem,state -r", {
      encoding: "utf-8",
      timeout: 5000,
    });

    return raw
      .split("\n")
      .slice(1)
      .filter(Boolean)
      .map((line) => {
        const parts = line.trim().split(/\s+/);
        const pid = parseInt(parts[0] ?? "0", 10);
        const name = parts[1] ?? "";
        const cpu = parseFloat(parts[2] ?? "0");
        const mem = parseFloat(parts[3] ?? "0");
        const rawState = parts[4] ?? "S";
        const status: ProcessInfo["status"] =
          rawState.startsWith("R") ? "running"
          : rawState.startsWith("S") ? "sleeping"
          : "stopped";

        return { pid, name, status, cpu, memory: mem };
      })
      .filter((p) => p.pid > 0);
  } catch (error) {
    logger.warn("Failed to list processes", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function processExists(name: string): boolean {
  try {
    execSync(`pgrep -i "${name}"`, { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}

export function isProcessResponsive(pid: number): boolean {
  try {
    const result = execSync(`ps -p ${pid} -o state=`, {
      encoding: "utf-8",
      timeout: 5000,
    }).trim();
    return !result.includes("Z") && !result.includes("T");
  } catch {
    return false;
  }
}

export function findProcess(name: string): ProcessInfo | null {
  return listProcesses().find((p) => p.name.toLowerCase().includes(name.toLowerCase())) ?? null;
}
