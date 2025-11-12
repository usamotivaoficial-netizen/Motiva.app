import { useState, useEffect } from 'react';
import { supabase, Quote } from '@/lib/supabase';
import { Language } from '@/hooks/useLanguage';

export function useFavorites(language: Language) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteQuotes, setFavoriteQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      try {
        const parsed = JSON.parse(savedFavorites);
        setFavorites(parsed);
      } catch (e) {
        setFavorites([]);
      }
    }
    setLoading(false);
  }, []);

  // Fetch favorite quotes when favorites or language changes
  useEffect(() => {
    async function fetchFavoriteQuotes() {
      if (favorites.length === 0) {
        setFavoriteQuotes([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('frases')
          .select('*')
          .in('id', favorites)
          .eq('lang', language);

        if (error) throw error;
        setFavoriteQuotes(data || []);
      } catch (err) {
        console.error('Erro ao carregar favoritos:', err);
        setFavoriteQuotes([]);
      }
    }

    fetchFavoriteQuotes();
  }, [favorites, language]);

  const toggleFavorite = (quoteId: string) => {
    const newFavorites = favorites.includes(quoteId)
      ? favorites.filter(id => id !== quoteId)
      : [...favorites, quoteId];

    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const isFavorite = (quoteId: string) => favorites.includes(quoteId);

  return {
    favorites,
    favoriteQuotes,
    toggleFavorite,
    isFavorite,
    loading
  };
}
