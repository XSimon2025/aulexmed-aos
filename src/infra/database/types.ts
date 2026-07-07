export type SupabaseResponse<T> = T[];

export type QueryParams = Record<string, string | number | boolean | undefined>;

export type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  params?: QueryParams;
  headers?: Record<string, string>;
};
