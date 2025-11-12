'use client';

import { useState, useEffect } from 'react';
import { supabase, Quote } from '@/lib/supabase';
import { getDayKey, hashStr } from '@/lib/utils/date';
import type { Language } from '@/contexts/AppContext';

interface DailyQuoteCache {
  id: string;
  text: string;
  category: string;
  is_premium?: boolean;
  isFallback?: boolean;
}

/**
 * Hook for fetching the daily quote (fixed for 24h per language)
 */
export function useDailyQuote(language: Language, isPro: boolean = false) {
  const [quote, setQuote] = useState<DailyQuoteCache | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDailyQuote() {
      setLoading(true);
      
      const dayKey = getDayKey('Europe/Lisbon');
      const cacheKey = `motiva.dailyQuote.${language}.${dayKey}.${isPro ? 'pro' : 'free'}`;
      
      // Check localStorage cache
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsedCache = JSON.parse(cached) as DailyQuoteCache;
          setQuote(parsedCache);
          setLoading(false);
          return;
        } catch (e) {
          // Invalid cache, continue to fetch
          localStorage.removeItem(cacheKey);
        }
      }

      // Fetch new quote deterministically
      try {
        // 1. Build query with premium filter for free users
        let countQuery = supabase
          .from('frases')
          .select('id', { count: 'exact', head: true })
          .eq('lang', language);
        
        // Free users: exclude premium
        if (!isPro) {
          countQuery = countQuery.eq('is_premium', false);
        }

        const { count, error: countError } = await countQuery;

        if (countError) throw countError;

        let finalLang = language;
        let total = count || 0;
        let isFallback = false;

        // Fallback to 'pt' if no quotes in selected language
        if (total === 0) {
          let ptCountQuery = supabase
            .from('frases')
            .select('id', { count: 'exact', head: true })
            .eq('lang', 'pt');
          
          if (!isPro) {
            ptCountQuery = ptCountQuery.eq('is_premium', false);
          }

          const { count: ptCount, error: ptCountError } = await ptCountQuery;

          if (ptCountError) throw ptCountError;
          
          total = ptCount || 0;
          finalLang = 'pt';
          isFallback = true;
        }

        if (total === 0) {
          setQuote(null);
          setLoading(false);
          return;
        }

        // 2. Calculate deterministic index based on day and language
        const hashInput = `${dayKey}|${language}`;
        const idx = hashStr(hashInput) % total;

        // 3. Fetch quote at that offset
        let fetchQuery = supabase
          .from('frases')
          .select('id, text, category, is_premium')
          .eq('lang', finalLang)
          .order('id', { ascending: true })
          .range(idx, idx);
        
        if (!isPro) {
          fetchQuery = fetchQuery.eq('is_premium', false);
        }

        const { data: rows, error: fetchError } = await fetchQuery;

        if (fetchError) throw fetchError;

        const fetchedQuote = rows?.[0];
        if (fetchedQuote) {
          const quoteCache: DailyQuoteCache = {
            id: fetchedQuote.id,
            text: fetchedQuote.text,
            category: fetchedQuote.category,
            is_premium: fetchedQuote.is_premium || false,
            isFallback
          };

          // Save to cache
          localStorage.setItem(cacheKey, JSON.stringify(quoteCache));
          setQuote(quoteCache);
        } else {
          setQuote(null);
        }
      } catch (error) {
        console.error('Error fetching daily quote:', error);
        setQuote(null);
      } finally {
        setLoading(false);
      }
    }

    fetchDailyQuote();
  }, [language, isPro]);

  return { quote, loading };
}

/**
 * Hook for fetching quotes by category (includes ALL quotes, premium and free)
 */
export function useQuotes(language: Language, category: string | null) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuotes() {
      setLoading(true);
      try {
        let query = supabase
          .from('frases')
          .select('*')
          .eq('lang', language)
          .order('created_at', { ascending: false });

        if (category) {
          query = query.eq('category', category);
        }

        const { data, error } = await query;

        if (error) throw error;
        setQuotes(data || []);
      } catch (error) {
        console.error('Error fetching quotes:', error);
        setQuotes([]);
      } finally {
        setLoading(false);
      }
    }

    fetchQuotes();
  }, [language, category]);

  return { quotes, loading };
}

/**
 * Hook for fetching distinct categories
 */
export function useCategories(language: Language) {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('frases')
          .select('category')
          .eq('lang', language)
          .order('category', { ascending: true });

        if (error) throw error;

        // Get distinct categories
        const distinctCategories = Array.from(
          new Set(data?.map(item => item.category) || [])
        );

        setCategories(distinctCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, [language]);

  return { categories, loading };
}
