import { useState, useEffect } from 'react';

export type Language = 'pt' | 'es';

export function useLanguage() {
  const [language, setLanguage] = useState<Language>('pt');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load language from localStorage on mount
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'pt' || savedLanguage === 'es')) {
      setLanguage(savedLanguage);
    }
    setIsLoaded(true);
  }, []);

  const updateLanguage = (newLanguage: Language) => {
    // Force lowercase to ensure "pt" not "PT"
    const normalizedLang = newLanguage.toLowerCase() as Language;
    setLanguage(normalizedLang);
    localStorage.setItem('language', normalizedLang);
  };

  return {
    language,
    setLanguage: updateLanguage,
    isLoaded
  };
}
