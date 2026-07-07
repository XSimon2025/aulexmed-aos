import { AppError, ErrorCode } from "../../core/errors/AppError.js";
import { getConfig } from "../../core/config/env.js";
import { logger } from "../../core/logging/logger.js";
import type { ChatMessage, AIConfig, AIResponse } from "./types.js";

const DEEPSEEK_API = "https://api.deepseek.com/v1/chat/completions";

export async function chat(
  messages: ChatMessage[],
  config: AIConfig = {},
): Promise<AIResponse> {
  const appConfig = getConfig();
  const model = config.model ?? appConfig.DEEPSEEK_MODEL;
  const temperature = config.temperature ?? 0.1;
  const maxTokens = config.maxTokens ?? 1200;

  logger.debug("DeepSeek request", { model, temperature, maxTokens, messageCount: messages.length });

  const response = await fetch(DEEPSEEK_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${appConfig.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
      stream: false,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "(no body)");
    throw new AppError(
      ErrorCode.AI_ERROR,
      `DeepSeek API error: ${response.status} ${response.statusText}`,
      { status: response.status, body },
    );
  }

  const data = (await response.json()) as {
    choices: Array<{ message: { content: string } }>;
    usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
  };

  const choice = data.choices[0];
  if (!choice) {
    throw new AppError(ErrorCode.AI_ERROR, "DeepSeek returned empty choices");
  }

  return {
    content: choice.message.content,
    usage: data.usage ? {
      promptTokens: data.usage.prompt_tokens,
      completionTokens: data.usage.completion_tokens,
      totalTokens: data.usage.total_tokens,
    } : undefined,
  };
}

export function extractJson<T>(content: string): T | null {
  const fenceMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonStr = fenceMatch?.[1] ?? content;

  const bracketStart = jsonStr.indexOf("{");
  const bracketEnd = jsonStr.lastIndexOf("}");
  if (bracketStart === -1 || bracketEnd === -1) return null;

  try {
    return JSON.parse(jsonStr.slice(bracketStart, bracketEnd + 1)) as T;
  } catch {
    return null;
  }
}
