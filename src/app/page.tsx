'use client';

import { useState, useEffect } from 'react';
import { Volume2, Share2, Heart, Target, Zap, TrendingUp, Dumbbell, Sparkles, Settings, Star, Crown, Bell, Info, ChevronLeft } from 'lucide-react';
import { CATEGORIES, TRANSLATIONS } from '@/lib/constants';
import { useLanguage } from '@/hooks/useLanguage';
import { useDailyQuote, useQuotes } from '@/hooks/useQuotes';
import { useFavorites } from '@/hooks/useFavorites';
import { shareQuote } from '@/lib/share';
import type { Category } from '@/lib/types';

type Screen = 'welcome' | 'main' | 'explore' | 'favorites' | 'premium' | 'settings';

export default function MotivaApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  const { language, setLanguage, isLoaded } = useLanguage();
  const { quote: dailyQuote, loading: quoteLoading } = useDailyQuote(language);
  const { quotes: categoryQuotes, loading: categoryLoading } = useQuotes(
    language,
    selectedCategory || undefined
  );
  const { favoriteQuotes, toggleFavorite, isFavorite } = useFavorites(language);

  const t = TRANSLATIONS[language];

  // Check if user has already selected language
  useEffect(() => {
    if (isLoaded) {
      const hasSelectedLanguage = localStorage.getItem('language');
      if (hasSelectedLanguage) {
        setCurrentScreen('main');
      }
    }
  }, [isLoaded]);

  const handleLanguageSelect = (lang: 'pt' | 'es') => {
    setLanguage(lang);
    setCurrentScreen('main');
  };

  const handleShare = async () => {
    if (!dailyQuote) return;

    const success = await shareQuote(dailyQuote.text, 'Motiva');
    if (success) {
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 2000);
    }
  };

  const handleListen = () => {
    if (!dailyQuote) return;
    
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(dailyQuote.text);
      utterance.lang = language === 'pt' ? 'pt-PT' : 'es-ES';
      speechSynthesis.speak(utterance);
    }
  };

  const getCategoryIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      Target, Zap, Heart, TrendingUp, Dumbbell, Sparkles
    };
    return icons[iconName] || Target;
  };

  // Show loading during initial load
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-[#5B4BFF] mb-4">Motiva</h1>
          <div className="animate-pulse text-gray-600">A carregar...</div>
        </div>
      </div>
    );
  }

  // Welcome Screen
  if (currentScreen === 'welcome') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-8 max-w-md">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold text-[#5B4BFF]">Motiva</h1>
            <p className="text-gray-600 text-lg">A tua dose diária de motivação</p>
          </div>

          <div className="space-y-4 pt-8">
            <p className="text-gray-700 font-medium text-xl">Escolhe o teu idioma</p>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => handleLanguageSelect('pt')}
                className="flex flex-col items-center gap-3 p-8 rounded-2xl border-2 border-gray-200 hover:border-[#5B4BFF] hover:bg-[#5B4BFF]/5 transition-all duration-300 min-w-[140px]"
              >
                <span className="text-5xl">🇵🇹</span>
                <span className="text-lg font-semibold text-gray-800">Português</span>
              </button>

              <button
                onClick={() => handleLanguageSelect('es')}
                className="flex flex-col items-center gap-3 p-8 rounded-2xl border-2 border-gray-200 hover:border-[#5B4BFF] hover:bg-[#5B4BFF]/5 transition-all duration-300 min-w-[140px]"
              >
                <span className="text-5xl">🇪🇸</span>
                <span className="text-lg font-semibold text-gray-800">Español</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Screen
  if (currentScreen === 'main') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="bg-[#5B4BFF] text-white p-6 rounded-b-3xl shadow-lg">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold">Motiva</h1>
            <p className="text-white/80 text-sm mt-1">{t.slogan}</p>
          </div>
        </div>

        {/* Quote Card */}
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="max-w-2xl w-full">
            {quoteLoading ? (
              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-6 bg-gray-200 rounded"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ) : dailyQuote ? (
              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
                <p className="text-sm font-semibold text-[#5B4BFF] mb-4 uppercase tracking-wide">
                  {t.quoteOfTheDay}
                </p>
                
                <p className="text-2xl md:text-3xl font-medium text-gray-800 leading-relaxed mb-8">
                  "{dailyQuote.text}"
                </p>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-center flex-wrap">
                  <button
                    onClick={handleListen}
                    className="flex items-center gap-2 px-6 py-3 bg-[#5B4BFF] text-white rounded-full hover:bg-[#4a3de6] transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Volume2 className="w-5 h-5" />
                    <span className="font-medium">{t.listen}</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-all duration-300"
                  >
                    <Share2 className="w-5 h-5" />
                    <span className="font-medium">{t.share}</span>
                  </button>

                  <button
                    onClick={() => toggleFavorite(dailyQuote.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
                      isFavorite(dailyQuote.id)
                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite(dailyQuote.id) ? 'fill-current' : ''}`} />
                    <span className="font-medium">
                      {isFavorite(dailyQuote.id) ? t.unfavorite : t.favorite}
                    </span>
                  </button>
                </div>

                {/* Copied Message */}
                {showCopiedMessage && (
                  <div className="mt-4 text-center text-sm text-green-600 font-medium">
                    {language === 'pt' ? 'Copiado!' : '¡Copiado!'}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 text-center">
                <p className="text-gray-600">
                  {language === 'pt' ? 'Erro ao carregar frase' : 'Error al cargar frase'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation */}
        <nav className="bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="max-w-4xl mx-auto flex justify-around">
            <button
              onClick={() => setCurrentScreen('main')}
              className="flex flex-col items-center gap-1 text-[#5B4BFF]"
            >
              <Sparkles className="w-6 h-6" />
              <span className="text-xs font-medium">Início</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('explore')}
              className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5B4BFF] transition-colors"
            >
              <Target className="w-6 h-6" />
              <span className="text-xs font-medium">{t.explore}</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('favorites')}
              className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5B4BFF] transition-colors"
            >
              <Heart className="w-6 h-6" />
              <span className="text-xs font-medium">{t.favorites}</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('premium')}
              className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5B4BFF] transition-colors"
            >
              <Crown className="w-6 h-6" />
              <span className="text-xs font-medium">{t.premium}</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('settings')}
              className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5B4BFF] transition-colors"
            >
              <Settings className="w-6 h-6" />
              <span className="text-xs font-medium">{t.settings}</span>
            </button>
          </div>
        </nav>
      </div>
    );
  }

  // Explore Screen
  if (currentScreen === 'explore') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="bg-[#5B4BFF] text-white p-6 rounded-b-3xl shadow-lg">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
            <div>
              <h1 className="text-3xl font-bold">{t.explore}</h1>
              <p className="text-white/80 text-sm mt-1">{t.categories}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {!selectedCategory ? (
            // Categories Grid
            <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4">
              {CATEGORIES.map((category) => {
                const Icon = getCategoryIcon(category.icon);
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className="p-6 rounded-2xl border-2 border-gray-200 hover:border-[#5B4BFF] hover:shadow-lg transition-all duration-300 flex flex-col items-center gap-3"
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <Icon className="w-8 h-8" style={{ color: category.color }} />
                    </div>
                    <span className="font-semibold text-gray-800">{category.name[language]}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            // Quotes List
            <div className="max-w-4xl mx-auto space-y-4">
              {categoryLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 animate-pulse">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : categoryQuotes.length > 0 ? (
                categoryQuotes.map((quote) => (
                  <div
                    key={quote.id}
                    className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <p className="text-lg text-gray-800 flex-1">"{quote.text}"</p>
                      <button
                        onClick={() => toggleFavorite(quote.id)}
                        className={`p-2 rounded-full transition-colors ${
                          isFavorite(quote.id)
                            ? 'text-red-600 bg-red-50'
                            : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${isFavorite(quote.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                    {quote.is_premium && (
                      <div className="mt-3 flex items-center gap-2 text-[#5B4BFF] text-sm font-medium">
                        <Crown className="w-4 h-4" />
                        <span>Premium</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-16 text-gray-600">
                  {language === 'pt' ? 'Nenhuma frase encontrada' : 'No se encontraron frases'}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <nav className="bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="max-w-4xl mx-auto flex justify-around">
            <button
              onClick={() => setCurrentScreen('main')}
              className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5B4BFF] transition-colors"
            >
              <Sparkles className="w-6 h-6" />
              <span className="text-xs font-medium">Início</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('explore')}
              className="flex flex-col items-center gap-1 text-[#5B4BFF]"
            >
              <Target className="w-6 h-6" />
              <span className="text-xs font-medium">{t.explore}</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('favorites')}
              className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5B4BFF] transition-colors"
            >
              <Heart className="w-6 h-6" />
              <span className="text-xs font-medium">{t.favorites}</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('premium')}
              className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5B4BFF] transition-colors"
            >
              <Crown className="w-6 h-6" />
              <span className="text-xs font-medium">{t.premium}</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('settings')}
              className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5B4BFF] transition-colors"
            >
              <Settings className="w-6 h-6" />
              <span className="text-xs font-medium">{t.settings}</span>
            </button>
          </div>
        </nav>
      </div>
    );
  }

  // Favorites Screen
  if (currentScreen === 'favorites') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="bg-[#5B4BFF] text-white p-6 rounded-b-3xl shadow-lg">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold">{t.favorites}</h1>
            <p className="text-white/80 text-sm mt-1">
              {favoriteQuotes.length} {language === 'pt' ? 'frases' : 'frases'}
            </p>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {favoriteQuotes.length === 0 ? (
            <div className="max-w-md mx-auto text-center py-16">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{t.noFavorites}</h3>
              <p className="text-gray-600">{t.addFavorites}</p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-4">
              {favoriteQuotes.map((quote) => (
                <div
                  key={quote.id}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex justify-between items-start gap-4">
                    <p className="text-lg text-gray-800 flex-1">"{quote.text}"</p>
                    <button
                      onClick={() => toggleFavorite(quote.id)}
                      className="p-2 rounded-full text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                    >
                      <Heart className="w-5 h-5 fill-current" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <nav className="bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="max-w-4xl mx-auto flex justify-around">
            <button
              onClick={() => setCurrentScreen('main')}
              className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5B4BFF] transition-colors"
            >
              <Sparkles className="w-6 h-6" />
              <span className="text-xs font-medium">Início</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('explore')}
              className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5B4BFF] transition-colors"
            >
              <Target className="w-6 h-6" />
              <span className="text-xs font-medium">{t.explore}</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('favorites')}
              className="flex flex-col items-center gap-1 text-[#5B4BFF]"
            >
              <Heart className="w-6 h-6" />
              <span className="text-xs font-medium">{t.favorites}</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('premium')}
              className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5B4BFF] transition-colors"
            >
              <Crown className="w-6 h-6" />
              <span className="text-xs font-medium">{t.premium}</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('settings')}
              className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5B4BFF] transition-colors"
            >
              <Settings className="w-6 h-6" />
              <span className="text-xs font-medium">{t.settings}</span>
            </button>
          </div>
        </nav>
      </div>
    );
  }

  // Premium Screen
  if (currentScreen === 'premium') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#5B4BFF] to-[#4a3de6] flex flex-col">
        {/* Header */}
        <div className="p-6">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <button
              onClick={() => setCurrentScreen('main')}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold text-white">{t.premiumTitle}</h1>
          </div>
        </div>

        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 space-y-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#5B4BFF] to-[#4a3de6] rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.premiumTitle}</h2>
              <p className="text-gray-600">{t.slogan}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-[#5B4BFF]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 text-[#5B4BFF]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{t.premiumFeature1}</h3>
                  <p className="text-sm text-gray-600">
                    {language === 'pt' ? 'Experiência sem interrupções' : 'Experiencia sin interrupciones'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-[#5B4BFF]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-[#5B4BFF]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{t.premiumFeature2}</h3>
                  <p className="text-sm text-gray-600">
                    {language === 'pt' ? 'Acesso a conteúdo exclusivo' : 'Acceso a contenido exclusivo'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-[#5B4BFF]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Volume2 className="w-5 h-5 text-[#5B4BFF]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{t.premiumFeature3}</h3>
                  <p className="text-sm text-gray-600">
                    {language === 'pt' ? 'Narração profissional das frases' : 'Narración profesional de las frases'}
                  </p>
                </div>
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-[#5B4BFF] to-[#4a3de6] text-white py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300">
              {t.subscribe}
            </button>
          </div>
        </div>

        {/* Bottom Navigation */}
        <nav className="bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="max-w-4xl mx-auto flex justify-around">
            <button
              onClick={() => setCurrentScreen('main')}
              className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5B4BFF] transition-colors"
            >
              <Sparkles className="w-6 h-6" />
              <span className="text-xs font-medium">Início</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('explore')}
              className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5B4BFF] transition-colors"
            >
              <Target className="w-6 h-6" />
              <span className="text-xs font-medium">{t.explore}</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('favorites')}
              className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5B4BFF] transition-colors"
            >
              <Heart className="w-6 h-6" />
              <span className="text-xs font-medium">{t.favorites}</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('premium')}
              className="flex flex-col items-center gap-1 text-[#5B4BFF]"
            >
              <Crown className="w-6 h-6" />
              <span className="text-xs font-medium">{t.premium}</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('settings')}
              className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5B4BFF] transition-colors"
            >
              <Settings className="w-6 h-6" />
              <span className="text-xs font-medium">{t.settings}</span>
            </button>
          </div>
        </nav>
      </div>
    );
  }

  // Settings Screen
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-[#5B4BFF] text-white p-6 rounded-b-3xl shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold">{t.settings}</h1>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Language Setting */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#5B4BFF]/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">{language === 'pt' ? '🇵🇹' : '🇪🇸'}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{t.language}</h3>
                  <p className="text-sm text-gray-600">
                    {language === 'pt' ? 'Português' : 'Español'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  const newLang = language === 'pt' ? 'es' : 'pt';
                  setLanguage(newLang);
                }}
                className="px-4 py-2 bg-[#5B4BFF] text-white rounded-full text-sm font-medium hover:bg-[#4a3de6] transition-colors"
              >
                {language === 'pt' ? 'Mudar' : 'Cambiar'}
              </button>
            </div>
          </div>

          {/* Notifications Setting */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#5B4BFF]/10 rounded-full flex items-center justify-center">
                <Bell className="w-6 h-6 text-[#5B4BFF]" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{t.notifications}</h3>
                <p className="text-sm text-gray-600">
                  {language === 'pt' ? 'Receber frases diárias' : 'Recibir frases diarias'}
                </p>
              </div>
            </div>
          </div>

          {/* About Setting */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#5B4BFF]/10 rounded-full flex items-center justify-center">
                <Info className="w-6 h-6 text-[#5B4BFF]" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{t.about}</h3>
                <p className="text-sm text-gray-600">{t.version}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center py-8 text-gray-600 text-sm">
            <p>{t.madeWith} ❤️ {t.by}</p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex justify-around">
          <button
            onClick={() => setCurrentScreen('main')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5B4BFF] transition-colors"
          >
            <Sparkles className="w-6 h-6" />
            <span className="text-xs font-medium">Início</span>
          </button>
          
          <button
            onClick={() => setCurrentScreen('explore')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5B4BFF] transition-colors"
          >
            <Target className="w-6 h-6" />
            <span className="text-xs font-medium">{t.explore}</span>
          </button>
          
          <button
            onClick={() => setCurrentScreen('favorites')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5B4BFF] transition-colors"
          >
            <Heart className="w-6 h-6" />
            <span className="text-xs font-medium">{t.favorites}</span>
          </button>
          
          <button
            onClick={() => setCurrentScreen('premium')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5B4BFF] transition-colors"
          >
            <Crown className="w-6 h-6" />
            <span className="text-xs font-medium">{t.premium}</span>
          </button>
          
          <button
            onClick={() => setCurrentScreen('settings')}
            className="flex flex-col items-center gap-1 text-[#5B4BFF]"
          >
            <Settings className="w-6 h-6" />
            <span className="text-xs font-medium">{t.settings}</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
