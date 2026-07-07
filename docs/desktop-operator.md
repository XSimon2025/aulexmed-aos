# Desktop Operator Architecture

Last updated: 2026-07-07

## 0. Principle Override

**Screen-based automation is a FALLBACK, not the default.**

The Desktop Operator's primary mode is OS-level desktop automation —
the same way a human operator sits at a computer and works.

截 图 + OCR + 视觉识别不是默认流程。

它们是备用能力。

只有无法直接定位元素或需要识别图片内容时才启用。

---

## 1. Architecture Layers

```
┌─────────────────────────────────────────┐
│              AOS Engine                  │
│  (ROE → task queue → human approval)    │
└──────────────────┬──────────────────────┘
                   │  "reply to review X"
                   ▼
┌─────────────────────────────────────────┐
│         DESKTOP OPERATOR (Primary)       │
│                                          │
│  Observe → Understand → Act → Verify    │
│  (continuous loop, stateful)            │
│                                          │
│  ┌──────────────────────────────────┐   │
│  │  Desktop Primitives              │   │
│  │  ├── Window Manager              │   │
│  │  ├── Keyboard Controller         │   │
│  │  ├── Mouse Controller            │   │
│  │  ├── Clipboard Controller        │   │
│  │  ├── Process Monitor             │   │
│  │  └── Accessibility Tree Reader   │   │
│  └──────────────────────────────────┘   │
│                                          │
│  ┌──────────────────────────────────┐   │
│  │  Visual Fallback (secondary)     │   │
│  │  ├── Screenshot Capture          │   │
│  │  ├── OCR Text Extraction         │   │
│  │  └── AI Visual Understanding     │   │
│  └──────────────────────────────────┘   │
└──────────────────┬──────────────────────┘
                   │  "focus TikTok, click Reply, type text"
                   ▼
┌─────────────────────────────────────────┐
│         BROWSER CONNECTOR                │
│  (Ziniao → Chrome → TikTok)             │
│                                          │
│  Maps Desktop Operator primitives to    │
│  browser-specific interaction patterns  │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│         PLATFORM CONNECTOR               │
│  (TikTok / Temu / Amazon)               │
│                                          │
│  Platform-specific workflows,            │
│  page structure knowledge,               │
│  navigation patterns                     │
└─────────────────────────────────────────┘
```

---

## 2. Core Loop — The Observe-Understand-Act-Verify Cycle

The Desktop Operator does NOT run a single script and exit.

It runs a **continuous stateful loop**:

```
while task.status !== "completed" && task.status !== "failed" {
  // ── STEP 1: OBSERVE ──
  const state = await observe()
  // Returns:
  // {
  //   activeWindow: { title, process, position, size },
  //   allWindows: [...],
  //   clipboardContent: string,
  //   pageState: "reviews_list" | "reply_dialog_open" | "loading" | "unknown",
  //   accessibilityTree: { buttons, textFields, staticTexts },
  //   screenshotBase64: string | null  // only if visual fallback needed
  // }

  // ── STEP 2: UNDERSTAND ──
  const context = await understand(state, task, previousStep)
  // Returns:
  // {
  //   currentStep: "click_reply_button",
  //   expectedNextState: "reply_dialog_open",
  //   confidence: 0.95
  // }

  // ── STEP 3: PLAN ──
  const action = await plan(context, state)
  // Returns:
  // {
  //   type: "keyboard_nav" | "mouse_click" | "clipboard_paste" | "wait" | "visual_locate",
  //   payload: { ... }
  // }

  // ── STEP 4: EXECUTE ──
  const result = await execute(action)
  // Returns:
  // {
  //   success: boolean,
  //   error?: string,
  //   newState?: DesktopState
  // }

  // ── STEP 5: VERIFY ──
  const verified = await verify(result, context.expectedNextState)
  // If state changed as expected → continue to next step
  // If state didn't change → retry or fallback to visual
  // If unexpected state → pause for human

  // ── STEP 6: RECORD ──
  await record(verified, task.id)
}
```

---

## 3. Desktop Primitives (Primary Layer)

### 3.1 Window Manager

```
Capabilities:
├── listAllWindows()        → WindowInfo[]
├── getActiveWindow()       → WindowInfo
├── focusWindow(title)      → void
├── focusProcess(name)      → void
├── getWindowPosition()     → { x, y, width, height }
├── moveWindow(x, y)        → void
├── resizeWindow(w, h)      → void
├── minimizeWindow()        → void
└── closeWindow()           → void

Implementation:
├── AppleScript (System Events)
├── CoreGraphics (CGSWindow) for low-level
└── cliclick for position queries

WindowInfo {
  title: string,
  processName: string,
  bundleId: string,
  position: { x, y },
  size: { width, height },
  isActive: boolean,
  isMinimized: boolean
}
```

### 3.2 Keyboard Controller

```
Capabilities:
├── typeText(text)          → types character by character
├── typeFast(text)          → pastes via clipboard (for long text)
├── pressKey(key)           → single key press
├── holdKey(key)            → key down
├── releaseKey(key)         → key up
├── keyCombo([mod, key])    → Cmd+C, Ctrl+V, etc.
├── pressSequence(keys)     → Tab, Tab, Enter

Implementation:
├── cliclick (t:, kp:, kd:, ku:)
├── CGEventPost (CoreGraphics) for low-level
└── osascript key code for system shortcuts

Strategy:
├── Tab navigation     → PRIMARY for form navigation
├── Enter/Space        → PRIMARY for button activation
├── Cmd+L              → address bar focus
├── Cmd+F              → page search
├── Arrow keys         → list navigation
├── Escape             → close dialogs
└── Character typing   → only when pasting is unsafe
```

### 3.3 Mouse Controller

```
Capabilities:
├── getPosition()                 → { x, y }
├── moveTo(x, y)                  → absolute move
├── moveRelative(dx, dy)          → relative move
├── click()                       → left click at current
├── clickAt(x, y)                 → left click at position
├── doubleClick()                 → double click
├── rightClick()                  → context menu
├── drag(from, to)                → drag operation
└── scroll(direction, amount)     → scroll wheel

Implementation:
├── cliclick (m:, c:, dc:, rc:, dd:, sc:)
└── CGEvent for programmatic control

Strategy:
├── Mouse is SECONDARY to keyboard
├── Only use mouse when:
│   ├── Element has no keyboard shortcut
│   ├── Need to click a specific screen coordinate
│   └── Drag-and-drop operations
└── Prefer keyboard Tab + Enter over mouse click
```

### 3.4 Clipboard Controller

```
Capabilities:
├── copy()                     → Cmd+C (copies current selection)
├── copyText(text)             → sets clipboard to text
├── paste()                    → Cmd+V
├── pasteText(text)            → set clipboard then paste
├── readClipboard()            → returns current content
├── clearClipboard()           → clears clipboard

Implementation:
├── pbcopy / pbpaste (macOS native)
├── cliclick key combos for copy/paste shortcuts
└── NSPasteboard API for programmatic access

Strategy:
├── PRIMARY method for entering long text
├── Review reply text → copy to clipboard → paste into reply box
├── Read clipboard to verify paste succeeded
└── Clear before/after sensitive operations
```

### 3.5 Process Monitor

```
Capabilities:
├── listProcesses()            → ProcessInfo[]
├── processExists(name)        → boolean
├── waitForProcess(name)       → waits until process appears
├── waitForProcessExit(name)   → waits until process disappears
├── isProcessResponsive(pid)   → boolean

Implementation:
├── ps aux parsing
├── NSWorkspace NSRunningApplications
└── pgrep / pidof

ProcessInfo {
  pid: number,
  name: string,
  cpu: number,
  memory: number,
  status: "running" | "sleeping" | "stopped" | "zombie"
}
```

### 3.6 Accessibility Tree Reader

```
Capabilities:
├── getAXTree(window)              → AXElement (root)
├── findElements(role, name)       → AXElement[]
├── getElementPosition(element)    → { x, y, w, h }
├── clickElement(element)          → AXPress
├── getElementValue(element)       → string
├── setElementValue(element, val)  → AXSetValue
├── elementExists(role, name)      → boolean
└── waitForElement(role, name)     → waits until appears

AXElement {
  role: "AXButton" | "AXTextField" | "AXStaticText" | "AXWindow" | ...
  title: string,
  value: string,
  position: { x, y, w, h },
  enabled: boolean,
  focused: boolean,
  children: AXElement[]
}

Implementation:
├── macOS Accessibility API (AXUIElement)
├── CoreGraphics AXUIElementCopyAttributeValue
└── Python pyobjc for rapid prototyping

Strategy:
├── PRIMARY method for element interaction
├── When Chromium exposes accessibility:
│   → Use AX for button clicks, text input, state reading
├── When accessibility tree is incomplete:
│   → Fall back to keyboard navigation
│   → Then fall back to visual recognition
└── This is the bridge between "desktop" and "browser"
```

---

## 4. Visual Fallback Layer (Secondary)

Only activated when:
1. Accessibility tree is empty or incomplete for target element
2. Keyboard navigation cannot reach the target
3. Need to verify a visual state (e.g., "is the success toast visible?")
4. Need to read image content (e.g., product photos, screenshots)

```
Capabilities:
├── captureScreen()              → base64 PNG
├── captureRegion(x,y,w,h)       → base64 PNG
├── captureWindow(title)         → base64 PNG
├── findTextInImage(text)        → { x, y } | null
├── findElementByDescription(desc) → { x, y } | null
├── readTextFromRegion(x,y,w,h)  → string
└── compareScreenshots(a, b)     → diff regions

Implementation:
├── screencapture (macOS native)
├── AI vision model (DeepSeek / GPT-4V) for element location
├── Tesseract OCR for text extraction
└── PIL/Pillow for image processing

Usage pattern:
1. Try AX tree → failed
2. Try keyboard navigation → stuck
3. Take screenshot → send to AI → "find the Reply button"
4. AI returns coordinates → click at coordinates
5. Take screenshot → verify state changed
```

---

## 5. Browser Connector

Translates Desktop Operator primitives into browser-specific workflows.

```
class ZiniaoBrowserConnector {
  // Window management
  async focus(): Promise<void>         // AppleScript: focus "ziniaobrowser"
  async ensureVisible(): Promise<void> // Check if window exists, unhide if needed

  // Page navigation
  async navigateTo(url: string): Promise<void>   // Cmd+L → type URL → Enter
  async waitForPageLoad(): Promise<void>          // Monitor window title / AX tree
  async getCurrentUrl(): Promise<string>          // AX: read address bar

  // Form interaction
  async clickButton(label: string): Promise<void>
  async fillTextField(label: string, text: string): Promise<void>
  async selectDropdown(label: string, option: string): Promise<void>

  // State detection
  async isPageLoaded(): Promise<boolean>
  async isDialogOpen(): Promise<boolean>
  async getPageTitle(): Promise<string>
}
```

---

## 6. Platform Connector (Example: TikTok)

```
class TikTokConnector {
  // Workflow: Reply to a review
  async replyToReview(reviewId: string, replyText: string): Promise<Result> {
    const steps = [
      { action: "navigate",   url: "https://seller.tiktok.com/review" },
      { action: "wait",       condition: "page_loaded" },
      { action: "find",       target: "review_row",  match: reviewId },
      { action: "click",      target: "reply_button" },
      { action: "wait",       condition: "reply_dialog_open" },
      { action: "focus",      target: "reply_textarea" },
      { action: "paste",      text: replyText },
      { action: "pause",      reason: "human_review_required" },  // STOP HERE
      { action: "click",      target: "submit_button" },           // Human approves
      { action: "wait",       condition: "success_toast" },
    ]

    for (const step of steps) {
      const result = await this.executeStep(step)
      if (!result.success) return fail(result.error)
    }
    return ok()
  }
}
```

---

## 7. Safety Layer (Permanent Hard Constraints)

These are NOT configurable. They are compiled into the operator.

```
BLOCKED_ACTIONS = [
  "click_submit_without_human_approval",  // Must pause before any final submit
  "click_refund",
  "click_compensation",
  "modify_order",
  "send_private_message",
  "delete_review",
  "change_account_settings",
  "navigate_to_billing",
  "download_sensitive_data"
]

CONFIRMATION_ACTIONS = [
  "click_submit",        // Requires human confirmation via Feishu or CLI
  "send_message",        // Requires human review of content
  "paste_into_form",     // Verify content before pasting
]

OBSERVABLE_ONLY = [
  "read_reviews",        // Safe
  "read_messages",       // Safe
  "check_order_status",  // Safe
  "navigate_pages",      // Safe (reading, not writing)
]
```

---

## 8. State Machine

```
IDLE
  │
  ▼
RECEIVED_TASK  (task from AOS engine: "reply to review #12345")
  │
  ▼
OBSERVING  (gather desktop state: windows, AX tree, page state)
  │
  ▼
PLANNING   (determine next action: keyboard nav, AX click, visual locate)
  │
  ▼
EXECUTING  (perform the action)
  │
  ├── success → VERIFYING
  │                │
  │                ├── expected state → OBSERVING (next step)
  │                └── unexpected state → OBSERVING (re-plan)
  │
  ├── blocked → ABORTED (action is on BLOCKED_ACTIONS list)
  │
  └── failed → RETRYING (up to N retries)
                   │
                   ├── retry success → VERIFYING
                   └── retry exhausted → NEEDS_HUMAN
```

---

## 9. Human-in-the-Loop Integration

The Desktop Operator NEVER completes a write operation autonomously.

```
At every PAUSE point:
  1. Take a screenshot of current state
  2. Send Feishu notification:
     "Desktop Operator: Ready to submit reply for review #12345
      Platform: TikTok
      Reply text: [preview]
      Action: Click Submit → Type: [paste reply]
      [Approve] [Reject] [Edit]"
  3. Wait for human response
  4. If approved → execute remaining steps
  5. If rejected → abort task, log reason
  6. If edit → receive new text, restart from paste step
```

---

## 10. Implementation Phases

### Phase A: Desktop Primitives (this is Sprint 3)

```
src/modules/operator/
├── types.ts                    # DesktopState, Action, Step, Task
├── desktop/
│   ├── window-manager.ts       # AppleScript window control
│   ├── keyboard.ts             # cliclick key control
│   ├── mouse.ts                # cliclick mouse control
│   ├── clipboard.ts            # pbcopy/pbpaste
│   └── process-monitor.ts      # ps + NSWorkspace
├── accessibility/
│   ├── ax-reader.ts            # AXUIElement tree reader
│   └── ax-writer.ts            # AXPress, AXSetValue
├── browser/
│   ├── connector.ts            # Browser abstraction
│   └── ziniaobrowser.ts        # Ziniao-specific adapter
├── visual/
│   ├── capture.ts              # screencapture wrapper
│   ├── ocr.ts                  # Tesseract / Vision
│   └── locate.ts               # AI visual element finder
├── loop/
│   ├── observer.ts             # State collection
│   ├── planner.ts              # Action planning
│   ├── executor.ts             # Action execution
│   └── verifier.ts             # State verification
└── safety/
    └── policy.ts               # BLOCKED / CONFIRMATION / OBSERVABLE
```

### Phase B: Browser + Platform Connectors

```
src/modules/operator/platforms/
├── tiktok/
│   ├── connector.ts            # TikTok-specific workflows
│   ├── navigation.ts           # URL patterns, page structure
│   └── selectors.ts            # Element identifiers (AX labels, keyboard paths)
├── temu/                       # Future
└── amazon/                     # Future
```

### Phase C: Integration with AOS Engine

```
ROE pipeline updated:
  review collected → AI analyzed → reply drafted
    → Desktop Operator: "navigate to TikTok, open reply, paste draft"
    → PAUSE for human approval
    → Human approves via Feishu
    → Desktop Operator: "click Submit, verify success"
    → Log result → task complete
```

---

## 11. CLI Commands

```bash
# Desktop Operator control
aos operator observe              # Dump current desktop state
aos operator windows              # List all windows
aos operator focus <name>         # Focus a window
aos operator type <text>          # Type text via keyboard
aos operator paste <text>         # Paste via clipboard
aos operator click <x> <y>        # Click at coordinates
aos operator ax-tree              # Dump accessibility tree of active window

# Platform workflows
aos operator tiktok reply --review-id <id> --text <reply> --dry-run
aos operator tiktok navigate --page reviews
```

---

## 12. Key Design Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Primary input method | Keyboard (Tab, Enter, shortcuts) | Deterministic, faster than mouse, immune to layout changes |
| Element targeting priority | AX tree → Keyboard nav → Visual | AX is structured data, keyboard is deterministic, visual is last resort |
| Text input method | Clipboard paste | Faster than typing, no character loss risk |
| State detection | Window title + AX tree changes + process events | Real-time, no polling needed |
| Screenshot frequency | Only when needed | Screenshots are expensive (I/O + AI processing) |
| Safety model | Blocklist + Confirmation gate | Permanent hard constraints, not configurable |
| Human approval | Feishu interactive card | Async, mobile-friendly, auditable |
