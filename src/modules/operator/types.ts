export interface WindowInfo {
  title: string;
  processName: string;
  pid: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isActive: boolean;
}

export interface ProcessInfo {
  pid: number;
  name: string;
  status: "running" | "sleeping" | "stopped";
  cpu: number;
  memory: number;
}

export interface AXElement {
  role: string;
  title: string;
  value: string;
  position: { x: number; y: number; width: number; height: number };
  enabled: boolean;
  focused: boolean;
  children: AXElement[];
}

export type PageState =
  | "unknown"
  | "loading"
  | "loaded"
  | "error"
  | "reviews_list"
  | "reply_dialog_open"
  | "reply_sent"
  | "login_required";

export interface DesktopState {
  activeWindow: WindowInfo | null;
  allWindows: WindowInfo[];
  clipboardContent: string;
  pageState: PageState;
  screenshotBase64: string | null;
  timestamp: string;
}

export type ActionType =
  | "key_press"
  | "key_combo"
  | "type_text"
  | "paste_text"
  | "mouse_move"
  | "mouse_click"
  | "mouse_double_click"
  | "mouse_right_click"
  | "focus_window"
  | "wait"
  | "navigate_url"
  | "ax_click"
  | "ax_set_value"
  | "screenshot_capture"
  | "visual_locate"
  | "pause_human";

export interface Action {
  type: ActionType;
  payload: Record<string, unknown>;
  description: string;
}

export interface ActionResult {
  success: boolean;
  error?: string;
  action: Action;
  duration: number;
}

export type TaskStatus =
  | "pending"
  | "observing"
  | "planning"
  | "executing"
  | "verifying"
  | "waiting_human"
  | "completed"
  | "failed"
  | "aborted";

export interface OperatorTask {
  id: string;
  module: string;
  platform: string;
  workflow: string;
  steps: Action[];
  currentStep: number;
  status: TaskStatus;
  result?: string;
  created_at: string;
  updated_at: string;
}

export interface OperationContext {
  currentStep: number;
  expectedNextState: PageState;
  confidence: number;
  reasoning: string;
}

export type SafetyDecision = "allow" | "block" | "confirm";
