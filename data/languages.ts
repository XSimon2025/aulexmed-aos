export const languages = [
  { code: "en", name: "English", region: "United States", routePrefix: "", isAvailable: true },
  { code: "de", name: "Deutsch", region: "Germany", routePrefix: "/de", isAvailable: false },
  { code: "fr", name: "Francais", region: "France", routePrefix: "/fr", isAvailable: false },
  { code: "es", name: "Espanol", region: "Spain", routePrefix: "/es", isAvailable: false },
  { code: "it", name: "Italiano", region: "Italy", routePrefix: "/it", isAvailable: false },
  { code: "nl", name: "Nederlands", region: "Netherlands", routePrefix: "/nl", isAvailable: false },
  { code: "pt", name: "Portugues", region: "Portugal", routePrefix: "/pt", isAvailable: false },
  { code: "pl", name: "Polski", region: "Poland", routePrefix: "/pl", isAvailable: false }
] as const;

export type LanguageCode = (typeof languages)[number]["code"];

export const languageStorageKey = "aulexmed-preferred-language";

export function normalizeLanguageCode(value?: string | null): LanguageCode {
  const code = value?.toLowerCase().split("-")[0];
  return languages.find((language) => language.code === code)?.code ?? "en";
}
