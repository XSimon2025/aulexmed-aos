import { logger } from "../../../core/logging/logger.js";
import { executeAction } from "./executor.js";
import { isDangerous } from "../safety/policy.js";
import type { OperatorTask } from "../types.js";
import type { Result } from "../../../core/types/index.js";
import { ok } from "../../../core/types/index.js";

export interface RunResult {
  taskId: string;
  status: "completed" | "paused_for_human" | "failed";
  completedSteps: number;
  totalSteps: number;
  error?: string;
}

export async function runTask(task: OperatorTask): Promise<Result<RunResult>> {
  logger.info("Starting operator task", {
    taskId: task.id,
    workflow: task.workflow,
    steps: task.steps.length,
  });

  let currentStep = task.currentStep;

  while (currentStep < task.steps.length) {
    const action = task.steps[currentStep];
    if (!action) break;

    if (isDangerous(action.type, action.description)) {
      logger.info("Task paused for human confirmation", {
        step: currentStep,
        action: action.description,
      });

      return ok({
        taskId: task.id,
        status: "paused_for_human",
        completedSteps: currentStep,
        totalSteps: task.steps.length,
      });
    }

    const result = await executeAction(action);

    if (!result.success) {
      return ok({
        taskId: task.id,
        status: "failed",
        completedSteps: currentStep,
        totalSteps: task.steps.length,
        error: result.error,
      });
    }

    currentStep++;
  }

  logger.info("Task completed", { taskId: task.id, steps: currentStep });

  return ok({
    taskId: task.id,
    status: "completed",
    completedSteps: currentStep,
    totalSteps: task.steps.length,
  });
}
