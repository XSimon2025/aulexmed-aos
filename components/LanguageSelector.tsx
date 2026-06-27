"use client";

import { useEffect, useState } from "react";
import { languages, languageStorageKey, normalizeLanguageCode, type LanguageCode } from "@/data/languages";

export function LanguageSelector() {
  const [selected, setSelected] = useState<LanguageCode>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(languageStorageKey);
    const detected = stored ?? window.navigator.language;
    const code = normalizeLanguageCode(detected);
    setSelected(code);
    window.localStorage.setItem(languageStorageKey, code);
  }, []);

  function handleChange(value: LanguageCode) {
    setSelected(value);
    window.localStorage.setItem(languageStorageKey, value);
  }

  return (
    <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
      <span className="hidden xl:inline">Language</span>
      <select
        value={selected}
        onChange={(event) => handleChange(event.target.value as LanguageCode)}
        className="rounded-md border border-brand-line bg-white px-2.5 py-2 text-xs font-semibold normal-case tracking-normal text-brand-navy outline-none transition hover:border-brand-blue focus:border-brand-blue"
        aria-label="Select language"
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.name}
          </option>
        ))}
      </select>
    </label>
  );
}
