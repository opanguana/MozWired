import english from '@/locales/en/common.json';
import portugueseMozambique from '@/locales/pt-MZ/common.json';
import type { SupportedLanguage } from '@/types/locale';

type DictionaryLeaf = string;
type Dictionary = {
  [key: string]: DictionaryLeaf | Dictionary;
};

type DotPath<T> = {
  [Key in keyof T & string]: T[Key] extends string
    ? Key
    : T[Key] extends Record<string, unknown>
      ? `${Key}.${DotPath<T[Key]>}`
      : never;
}[keyof T & string];

export type TranslationKey = DotPath<typeof english>;
export type TranslationVariables = Record<string, string | number>;

const dictionaries: Record<SupportedLanguage, Dictionary> = {
  en: english,
  'pt-MZ': portugueseMozambique,
};

function findMessage(dictionary: Dictionary, key: string): string | undefined {
  let current: DictionaryLeaf | Dictionary = dictionary;

  for (const segment of key.split('.')) {
    if (typeof current === 'string' || !(segment in current)) return undefined;
    current = current[segment];
  }

  return typeof current === 'string' ? current : undefined;
}

function interpolate(message: string, variables: TranslationVariables): string {
  return message.replace(/\{\{(\w+)\}\}/g, (match, name: string) =>
    Object.hasOwn(variables, name) ? String(variables[name]) : match
  );
}

export function translate(
  language: SupportedLanguage,
  key: TranslationKey,
  variables: TranslationVariables = {}
): string {
  const localized = findMessage(dictionaries[language], key);
  const fallback = findMessage(dictionaries.en, key);

  if (!localized && language !== 'en' && process.env.NODE_ENV !== 'production') {
    console.warn(`[i18n:${language}] Missing translation for "${key}"; using English.`);
  }

  if (!localized && !fallback) {
    throw new Error(`Missing required English translation for "${key}".`);
  }

  return interpolate(localized ?? fallback!, variables);
}
