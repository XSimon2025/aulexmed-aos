export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIConfig {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}
