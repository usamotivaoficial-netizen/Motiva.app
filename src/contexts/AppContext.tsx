'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'pt' | 'es';

interface AppState {
  language: Language;
  selectedCategory: string | null;
  isPro: boolean;
  setLanguage: (lang: Language) => void;
  setSelectedCategory: (category: string | null) => void;
  setIsPro: (isPro: boolean) => void;
  isLoaded: boolean;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('pt');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isPro, setIsProState] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load language and isPro from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'pt' || savedLanguage === 'es')) {
      setLanguageState(savedLanguage);
    }
    
    const savedIsPro = localStorage.getItem('isPro');
    if (savedIsPro === 'true') {
      setIsProState(true);
    }
    
    setIsLoaded(true);
  }, []);

  const setLanguage = (newLanguage: Language) => {
    // Force lowercase to ensure "pt" not "PT"
    const normalizedLang = newLanguage.toLowerCase() as Language;
    setLanguageState(normalizedLang);
    localStorage.setItem('language', normalizedLang);
    // Reset category when changing language
    setSelectedCategory(null);
  };

  const setIsPro = (newIsPro: boolean) => {
    setIsProState(newIsPro);
    localStorage.setItem('isPro', newIsPro.toString());
  };

  return (
    <AppContext.Provider
      value={{
        language,
        selectedCategory,
        isPro,
        setLanguage,
        setSelectedCategory,
        setIsPro,
        isLoaded
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within AppProvider');
  }
  return context;
}
