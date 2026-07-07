import { getConfig } from "../../../core/config/env.js";

export function getROEStage(): number {
  try {
    getConfig();
    const raw = process.env["AOS_ROE_STAGE"];
    if (raw) {
      const n = Number(raw);
      if (n >= 1) return n;
    }
    return 1;
  } catch {
    return 1;
  }
}
