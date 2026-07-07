export enum ErrorCode {
  CONFIG_MISSING = "CONFIG_MISSING",
  CONFIG_INVALID = "CONFIG_INVALID",
  DATABASE_ERROR = "DATABASE_ERROR",
  AI_ERROR = "AI_ERROR",
  NOTIFY_ERROR = "NOTIFY_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  NOT_FOUND = "NOT_FOUND",
  CONFLICT = "CONFLICT",
  INTERNAL_ERROR = "INTERNAL_ERROR",
}

export class AppError extends Error {
  public readonly code: ErrorCode;
  public override readonly cause?: unknown;

  constructor(code: ErrorCode, message: string, cause?: unknown) {
    super(message);
    this.code = code;
    this.cause = cause;
  }

  override get name(): string {
    return "AppError";
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
    };
  }
}
