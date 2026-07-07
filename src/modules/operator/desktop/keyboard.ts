import { execSync } from "node:child_process";

type KeyModifier = "cmd" | "ctrl" | "alt" | "shift";

function runCliclick(cmd: string): void {
  execSync(`cliclick ${cmd}`, { timeout: 5000 });
}

export function pressKey(key: string): void {
  runCliclick(`kp:${key}`);
}

export function typeText(text: string): void {
  execSync(`printf '%s' "${text.replace(/"/g, '\\"').replace(/`/g, '\\`').replace(/\$/g, '\\$')}" | pbcopy`, { timeout: 5000 });
  keyCombo(["cmd"], "v");
}

export function keyCombo(modifiers: KeyModifier[], key: string): void {
  const parts: string[] = [];
  for (const mod of modifiers) {
    parts.push(`kd:${mod}`);
  }
  parts.push(`t:${key}`);
  for (let i = modifiers.length - 1; i >= 0; i--) {
    parts.push(`ku:${modifiers[i]!}`);
  }
  runCliclick(parts.join(" "));
}

export function cmdA(): void { keyCombo(["cmd"], "a"); }
export function cmdC(): void { keyCombo(["cmd"], "c"); }
export function cmdV(): void { keyCombo(["cmd"], "v"); }
export function cmdW(): void { keyCombo(["cmd"], "w"); }
export function cmdL(): void { keyCombo(["cmd"], "l"); }
export function pressEnter(): void { pressKey("enter"); }
export function pressTab(): void { pressKey("tab"); }
export function pressEscape(): void { pressKey("escape"); }
export function pressArrow(direction: "up" | "down" | "left" | "right"): void {
  pressKey(`arrow-${direction}`);
}
