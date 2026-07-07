export function extractJsonObject<T>(content: string): T | null {
  const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced?.[1] || content;
  const firstBrace = candidate.indexOf("{");
  const lastBrace = candidate.lastIndexOf("}");

  if (firstBrace < 0 || lastBrace <= firstBrace) return null;

  try {
    return JSON.parse(candidate.slice(firstBrace, lastBrace + 1)) as T;
  } catch {
    return null;
  }
}

export function readJsonArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object" && Array.isArray((value as { reviews?: unknown }).reviews)) {
    return (value as { reviews: T[] }).reviews;
  }
  throw new Error("Expected a JSON array or an object with a reviews array.");
}
