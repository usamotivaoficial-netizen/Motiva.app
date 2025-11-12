import { useState, useEffect } from 'react';
import { supabase, Quote } from '@/lib/supabase';
import { Language } from '@/hooks/useLanguage';

export function useQuotes(language: Language, category?: string) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuotes() {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('frases')
          .select('*')
          .eq('lang', language)
          .eq('is_premium', false);

        if (category) {
          query = query.eq('category', category);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;

        // Fallback to Portuguese if no results in Spanish
        if (!data || data.length === 0) {
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('frases')
            .select('*')
            .eq('lang', 'pt')
            .eq('is_premium', false);

          if (fallbackError) throw fallbackError;
          setQuotes(fallbackData || []);
        } else {
          setQuotes(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar frases');
        setQuotes([]);
      } finally {
        setLoading(false);
      }
    }

    fetchQuotes();
  }, [language, category]);

  return { quotes, loading, error };
}

export function useDailyQuote(language: Language) {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDailyQuote() {
      try {
        setLoading(true);
        setError(null);

        // Try to get a random quote in the selected language
        const { data, error: fetchError } = await supabase
          .from('frases')
          .select('*')
          .eq('lang', language)
          .eq('is_premium', false)
          .limit(50); // Get 50 to randomize client-side

        if (fetchError) throw fetchError;

        // Fallback to Portuguese if no results
        if (!data || data.length === 0) {
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('frases')
            .select('*')
            .eq('lang', 'pt')
            .eq('is_premium', false)
            .limit(50);

          if (fallbackError) throw fallbackError;

          if (fallbackData && fallbackData.length > 0) {
            const randomIndex = Math.floor(Math.random() * fallbackData.length);
            setQuote(fallbackData[randomIndex]);
          }
        } else {
          const randomIndex = Math.floor(Math.random() * data.length);
          setQuote(data[randomIndex]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar frase');
        setQuote(null);
      } finally {
        setLoading(false);
      }
    }

    fetchDailyQuote();
  }, [language]);

  return { quote, loading, error, refetch: () => fetchDailyQuote() };
}
