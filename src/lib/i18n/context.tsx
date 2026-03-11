'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { translations, languages, LanguageCode } from './translations'

type Translations = typeof translations['en']

interface LanguageContextType {
  language: LanguageCode
  setLanguage: (lang: LanguageCode) => void
  t: Translations
  languages: typeof languages
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load saved language from localStorage
    const saved = localStorage.getItem('brainrank_language') as LanguageCode
    if (saved && translations[saved]) {
      setLanguageState(saved)
    } else {
      // Try to detect from browser
      const browserLang = navigator.language.split('-')[0] as LanguageCode
      if (translations[browserLang]) {
        setLanguageState(browserLang)
      }
    }
  }, [])

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang)
    localStorage.setItem('brainrank_language', lang)
    // Update HTML dir attribute for RTL languages
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }

  // Set RTL on mount if needed
  useEffect(() => {
    if (mounted) {
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    }
  }, [mounted, language])

  const t = translations[language]

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Hook that returns translations with SSR fallback
export function useTranslations() {
  const context = useContext(LanguageContext)
  // Return English as fallback during SSR or if context not available
  return context?.t ?? translations.en
}
