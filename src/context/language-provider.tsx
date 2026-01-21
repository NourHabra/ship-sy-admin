import { createContext, useContext, useEffect, useState } from 'react'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'
import { en, ar, type Translation } from '@/locales'
import { useDirection } from './direction-provider'

export type Language = 'en' | 'ar'

const DEFAULT_LANGUAGE: Language = 'ar'
const LANGUAGE_COOKIE_NAME = 'lang'
const LANGUAGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

const translations: Record<Language, Translation> = {
  en,
  ar,
}

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: Translation
  resetLanguage: () => void
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, _setLanguage] = useState<Language>(
    () => (getCookie(LANGUAGE_COOKIE_NAME) as Language) || DEFAULT_LANGUAGE
  )
  const { setDir } = useDirection()

  useEffect(() => {
    // Automatically set direction based on language
    if (language === 'ar') {
      setDir('rtl')
    } else {
      setDir('ltr')
    }

    // Update HTML lang attribute
    document.documentElement.setAttribute('lang', language)
  }, [language, setDir])

  const setLanguage = (lang: Language) => {
    _setLanguage(lang)
    setCookie(LANGUAGE_COOKIE_NAME, lang, LANGUAGE_COOKIE_MAX_AGE)
  }

  const resetLanguage = () => {
    _setLanguage(DEFAULT_LANGUAGE)
    removeCookie(LANGUAGE_COOKIE_NAME)
  }

  return (
    <LanguageContext
      value={{
        language,
        setLanguage,
        t: translations[language],
        resetLanguage,
      }}
    >
      {children}
    </LanguageContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

