'use client';

import { useState, useEffect } from 'react';
import { Volume2, Share2, Heart, Target, Zap, TrendingUp, Dumbbell, Sparkles, Settings, Star, Crown, Bell, Info, ChevronLeft, RefreshCw, Lock, X } from 'lucide-react';
import { CATEGORIES, TRANSLATIONS, i18n } from '@/lib/constants';
import { useAppState } from '@/contexts/AppContext';
import { useDailyQuote, useQuotes, useCategories } from '@/hooks/useQuotes';
import { useFavorites } from '@/hooks/useFavorites';
import { shareQuote } from '@/lib/share';
import type { Category } from '@/lib/types';

type Screen = 'welcome' | 'main' | 'explore' | 'favorites' | 'premium' | 'settings';

const CROP_BOTTOM = '24%'; // corta ~24% da parte de baixo (ajustável)

function AppHeader() {
  return (
    <header style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          height: 44,
          width: 140,
          overflow: 'hidden',
          borderRadius: 12
        }}
      >
        <img
          src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/2f3f0474-85ce-4ae5-b7e9-4196e050b37f.png"
          alt="Motiva"
          style={{
            height: 72,           // maior que o container para permitir crop
            width: 'auto',
            display: 'block',
            objectFit: 'cover',
            objectPosition: 'center top',
            clipPath: `inset(0 0 ${CROP_BOTTOM} 0)` // recorta a parte inferior (tagline)
          }}
        />
      </div>
    </header>
  );
}

// Premium Unlock Bottom Sheet Component
function PremiumUnlockSheet({ isOpen, onClose, onUpgrade, language }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onUpgrade: () => void;
  language: 'pt' | 'es';
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={onClose}>
      <div 
        className="bg-white rounded-t-3xl w-full max-w-2xl p-8 shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">
            {language === 'pt' ? 'Conteúdo Premium' : 'Contenido Premium'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#5B4BFF] to-[#4a3de6] rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <p className="text-center text-gray-600 text-lg">
            {language === 'pt' 
              ? 'Desbloqueia para ver e partilhar todas as frases premium.' 
              : 'Desbloquea para ver y compartir todas las frases premium.'}
          </p>
        </div>

        <button
          onClick={onUpgrade}
          className="w-full bg-gradient-to-r from-[#5B4BFF] to-[#4a3de6] text-white py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {language === 'pt' ? 'Quero ser Pro' : 'Quiero ser Pro'}
        </button>
      </div>
    </div>
  );
}

export default function MotivaApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [showPremiumSheet, setShowPremiumSheet] = useState(false);
  const [selectedPremiumQuote, setSelectedPremiumQuote] = useState<string | null>(null);

  const { language, selectedCategory, isPro, setLanguage, setSelectedCategory, setIsPro, isLoaded } = useAppState();
  const { quote: dailyQuote, loading: quoteLoading } = useDailyQuote(language, isPro);
  const { quotes: categoryQuotes, loading: categoryLoading } = useQuotes(
    language,
    selectedCategory
  );
  const { categories: dbCategories, loading: categoriesLoading } = useCategories(language);
  const { favoriteQuotes, toggleFavorite, isFavorite } = useFavorites(language);

  const t = TRANSLATIONS[language];
  const translations = i18n[language];

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

  const handleLanguageChange = (newLang: 'pt' | 'es') => {
    setLanguage(newLang);
  };

  const handleShare = async (quoteText?: string, isPremium?: boolean) => {
    // Block if premium and not pro
    if (isPremium && !isPro) {
      setShowPremiumSheet(true);
      return;
    }

    const textToShare = quoteText || dailyQuote?.text;
    if (!textToShare) return;

    const success = await shareQuote(textToShare, 'Motiva');
    if (success) {
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 2000);
    }
  };

  const handleListen = (quoteText?: string, isPremium?: boolean) => {
    // Block if premium and not pro
    if (isPremium && !isPro) {
      setShowPremiumSheet(true);
      return;
    }

    const textToSpeak = quoteText || dailyQuote?.text;
    if (!textToSpeak) return;
    
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = language === 'pt' ? 'pt-PT' : 'es-ES';
      speechSynthesis.speak(utterance);
    }
  };

  const handleFavorite = (quoteId: string, isPremium?: boolean) => {
    // Block if premium and not pro
    if (isPremium && !isPro) {
      setShowPremiumSheet(true);
      return;
    }
    toggleFavorite(quoteId);
  };

  const handlePremiumQuoteClick = (quoteId: string, isPremium?: boolean) => {
    if (isPremium && !isPro) {
      setSelectedPremiumQuote(quoteId);
      setShowPremiumSheet(true);
    }
  };

  const handleUpgradeToPro = () => {
    setIsPro(true);
    setShowPremiumSheet(false);
    setSelectedPremiumQuote(null);
  };

  const handleRefreshDay = () => {
    // DEV ONLY: Clear daily quote cache and reload
    if (process.env.NODE_ENV === 'development') {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('motiva.dailyQuote.')) {
          localStorage.removeItem(key);
        }
      });
      window.location.reload();
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
          <AppHeader />
          <div className="animate-pulse text-gray-600 mt-4">A carregar...</div>
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
            <AppHeader />
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
    const isQuotePremium = dailyQuote?.is_premium && !isPro;

    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="bg-[#5B4BFF] text-white p-6 rounded-b-3xl shadow-lg">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <AppHeader />
            <p className="text-white/80 text-sm mt-2">{t.slogan}</p>
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
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-[#5B4BFF] uppercase tracking-wide">
                    {translations.daily}
                  </p>
                  <div className="flex items-center gap-2">
                    {dailyQuote.isFallback && (
                      <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-medium">
                        (PT)
                      </span>
                    )}
                    {isQuotePremium && (
                      <span className="flex items-center gap-1 text-xs bg-purple-100 text-[#5B4BFF] px-3 py-1 rounded-full font-medium">
                        <Crown className="w-3 h-3" />
                        Premium
                      </span>
                    )}
                  </div>
                </div>
                
                {isQuotePremium ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-xl text-gray-600 mb-6">
                      {language === 'pt' 
                        ? 'Conteúdo premium bloqueado' 
                        : 'Contenido premium bloqueado'}
                    </p>
                    <button
                      onClick={() => setShowPremiumSheet(true)}
                      className="px-8 py-3 bg-gradient-to-r from-[#5B4BFF] to-[#4a3de6] text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {language === 'pt' ? 'Desbloquear Pro' : 'Desbloquear Pro'}
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-2xl md:text-3xl font-medium text-gray-800 leading-relaxed mb-2">
                      "{dailyQuote.text}"
                    </p>

                    <p className="text-sm text-gray-500 mb-8 capitalize">
                      {dailyQuote.category}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-3 justify-center flex-wrap">
                      <button
                        onClick={() => handleListen()}
                        className="flex items-center gap-2 px-6 py-3 bg-[#5B4BFF] text-white rounded-full hover:bg-[#4a3de6] transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        <Volume2 className="w-5 h-5" />
                        <span className="font-medium">{t.listen}</span>
                      </button>

                      <button
                        onClick={() => handleShare()}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-all duration-300"
                      >
                        <Share2 className="w-5 h-5" />
                        <span className="font-medium">{t.share}</span>
                      </button>

                      <button
                        onClick={() => handleFavorite(dailyQuote.id)}
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
                  </>
                )}

                {/* DEV ONLY: Refresh Day Button */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={handleRefreshDay}
                      className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 mx-auto"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Atualizar dia (dev)</span>
                    </button>
                  </div>
                )}

                {/* Copied Message */}
                {showCopiedMessage && (
                  <div className="mt-4 text-center text-sm text-green-600 font-medium">
                    {language === 'pt' ? 'Copiado ✅' : '¡Copiado ✅!'}
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

        {/* Premium Unlock Sheet */}
        <PremiumUnlockSheet
          isOpen={showPremiumSheet}
          onClose={() => setShowPremiumSheet(false)}
          onUpgrade={handleUpgradeToPro}
          language={language}
        />

        {/* Bottom Navigation */}
        <nav className="bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="max-w-4xl mx-auto flex justify-around">
            <button
              onClick={() => setCurrentScreen('main')}
              className="flex flex-col items-center gap-1 text-[#5B4BFF]"
            >
              <Sparkles className="w-6 h-6" />
              <span className="text-xs font-medium">{translations.home}</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('explore')}
              className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5B4BFF] transition-colors"
            >
              <Target className="w-6 h-6" />
              <span className="text-xs font-medium">{translations.explore}</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('favorites')}
              className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5B4BFF] transition-colors"
            >
              <Heart className="w-6 h-6" />
              <span className="text-xs font-medium">{translations.favorites}</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('premium')}
              className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5B4BFF] transition-colors"
            >
              <Crown className="w-6 h-6" />
              <span className="text-xs font-medium">{translations.premium}</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('settings')}
              className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5B4BFF] transition-colors"
            >
              <Settings className="w-6 h-6" />
              <span className="text-xs font-medium">{translations.settings}</span>
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
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold">{translations.explore}</h1>
            <p className="text-white/80 text-sm mt-1">{t.categories}</p>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {/* Category Chips */}
          <div className="max-w-4xl mx-auto mb-6">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === null
                    ? 'bg-[#5B4BFF] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {translations.all}
              </button>
              {categoriesLoading ? (
                <div className="px-4 py-2 bg-gray-100 rounded-full animate-pulse">
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                </div>
              ) : (
                dbCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 capitalize ${
                      selectedCategory === category
                        ? 'bg-[#5B4BFF] text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Quotes List */}
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
              categoryQuotes.map((quote) => {
                const isQuotePremium = quote.is_premium && !isPro;
                
                return (
                  <div
                    key={quote.id}
                    onClick={() => handlePremiumQuoteClick(quote.id, quote.is_premium)}
                    className={`bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transition-all duration-300 ${
                      isQuotePremium ? 'cursor-pointer hover:shadow-xl' : 'hover:shadow-xl'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        {isQuotePremium ? (
                          <div className="flex items-center gap-3">
                            <Lock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            <p className="text-lg text-gray-400 blur-sm select-none">
                              "{quote.text.substring(0, 50)}..."
                            </p>
                          </div>
                        ) : (
                          <p className="text-lg text-gray-800">"{quote.text}"</p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {quote.is_premium && (
                          <span className="flex items-center gap-1 text-xs bg-purple-100 text-[#5B4BFF] px-2 py-1 rounded-full font-medium">
                            <Crown className="w-3 h-3" />
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFavorite(quote.id, quote.is_premium);
                          }}
                          disabled={isQuotePremium}
                          className={`p-2 rounded-full transition-colors ${
                            isQuotePremium
                              ? 'text-gray-300 cursor-not-allowed'
                              : isFavorite(quote.id)
                              ? 'text-red-600 bg-red-50'
                              : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                          }`}
                          title={isQuotePremium ? (language === 'pt' ? 'Disponível no Pro' : 'Disponible en Pro') : ''}
                        >
                          <Heart className={`w-5 h-5 ${isFavorite(quote.id) && !isQuotePremium ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Action buttons for non-premium quotes */}
                    {!isQuotePremium && (
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleListen(quote.text);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                        >
                          <Volume2 className="w-4 h-4" />
                          <span>{t.listen}</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(quote.text);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                        >
                          <Share2 className="w-4 h-4" />
                          <span>{t.share}</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16 text-gray-600">
                {language === 'pt' ? 'Nenhuma frase encontrada' : 'No se encontraron frases'}
              </div>
            )}
          </div>
        </div>

        {/* Premium Unlock Sheet */}
        <PremiumUnlockSheet
          isOpen={showPremiumSheet}
          onClose={() => {
            setShowPremiumSheet(false);
            setSelectedPremiumQuote(null);
          }}
          onUpgrade={handleUpgradeToPro}
          language={language}
        />

        {/* Bottom Navigation */}
        <nav className="bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="max-w-4xl mx-auto flex justify-around">
            <button
              onClick={() => setCurrentScreen('main')}
              className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5B4BFF] transition-colors"
            >
              <Sparkles className="w-6 h-6" />
              <span className="text-xs font-medium">{translations.home}</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('explore')}
              className="flex flex-col items-center gap-1 text-[#5B4BFF]"
            >
              <Target className="w-6 h-6" />
              <span className="text-xs font-medium">{translations.explore}</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('favorites')}
              className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5B4BFF] transition-colors"
            >
              <Heart className="w-6 h-6" />
              <span className="text-xs font-medium">{translations.favorites}</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('premium')}
              className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5B4BFF] transition-colors"
            >
              <Crown className="w-6 h-6" />
              <span className="text-xs font-medium">{translations.premium}</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('settings')}
              className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5B4BFF] transition-colors"
            >
              <Settings className="w-6 h-6" />
              <span className="text-xs font-medium">{translations.settings}</span>
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
            <h1 className="text-3xl font-bold">{translations.favorites}</h1>
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
              <span className="text-xs font-medium">{translations.home}</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('explore')}
              className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5B4BFF] transition-colors"
            >
              <Target className="w-6 h-6" />
              <span className="text-xs font-medium">{translations.explore}</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('favorites')}
              className="flex flex-col items-center gap-1 text-[#5B4BFF]"
            >
              <Heart className="w-6 h-6" />
              <span className="text-xs font-medium">{translations.favorites}</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('premium')}
              className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5B4BFF] transition-colors"
            >
              <Crown className="w-6 h-6" />
              <span className="text-xs font-medium">{translations.premium}</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('settings')}
              className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5B4BFF] transition-colors"
            >
              <Settings className="w-6 h-6" />
              <span className="text-xs font-medium">{translations.settings}</span>
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
              <span className="text-xs font-medium">{translations.home}</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('explore')}
              className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5B4BFF] transition-colors"
            >
              <Target className="w-6 h-6" />
              <span className="text-xs font-medium">{translations.explore}</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('favorites')}
              className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5B4BFF] transition-colors"
            >
              <Heart className="w-6 h-6" />
              <span className="text-xs font-medium">{translations.favorites}</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('premium')}
              className="flex flex-col items-center gap-1 text-[#5B4BFF]"
            >
              <Crown className="w-6 h-6" />
              <span className="text-xs font-medium">{translations.premium}</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('settings')}
              className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5B4BFF] transition-colors"
            >
              <Settings className="w-6 h-6" />
              <span className="text-xs font-medium">{translations.settings}</span>
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
          <h1 className="text-3xl font-bold">{translations.settings}</h1>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Pro Toggle (Dev/Testing) */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#5B4BFF]/10 rounded-full flex items-center justify-center">
                  <Crown className="w-6 h-6 text-[#5B4BFF]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {language === 'pt' ? 'Sou Pro' : 'Soy Pro'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {language === 'pt' ? 'Ativar modo premium (teste)' : 'Activar modo premium (prueba)'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPro(!isPro)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  isPro ? 'bg-[#5B4BFF]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    isPro ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

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
                  handleLanguageChange(newLang);
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
            <span className="text-xs font-medium">{translations.home}</span>
          </button>
          
          <button
            onClick={() => setCurrentScreen('explore')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5B4BFF] transition-colors"
          >
            <Target className="w-6 h-6" />
            <span className="text-xs font-medium">{translations.explore}</span>
          </button>
          
          <button
            onClick={() => setCurrentScreen('favorites')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5B4BFF] transition-colors"
          >
            <Heart className="w-6 h-6" />
            <span className="text-xs font-medium">{translations.favorites}</span>
          </button>
          
          <button
            onClick={() => setCurrentScreen('premium')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#5B4BFF] transition-colors"
          >
            <Crown className="w-6 h-6" />
            <span className="text-xs font-medium">{translations.premium}</span>
          </button>
          
          <button
            onClick={() => setCurrentScreen('settings')}
            className="flex flex-col items-center gap-1 text-[#5B4BFF]"
          >
            <Settings className="w-6 h-6" />
            <span className="text-xs font-medium">{translations.settings}</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
