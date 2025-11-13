'use client';

import { useState, useEffect } from 'react';
import { Volume2, Share2, Heart, Target, Zap, TrendingUp, Dumbbell, Sparkles, Settings, Star, Crown, Bell, Info, ChevronLeft, RefreshCw, Lock, X, Globe } from 'lucide-react';
import { CATEGORIES, TRANSLATIONS, i18n } from '@/lib/constants';
import { useAppState } from '@/contexts/AppContext';
import { useDailyQuote, useQuotes, useCategories } from '@/hooks/useQuotes';
import { useFavorites } from '@/hooks/useFavorites';
import { shareQuote } from '@/lib/share';
import type { Category } from '@/lib/types';

type Screen = 'welcome' | 'main' | 'explore' | 'favorites' | 'premium' | 'settings';

// Premium Unlock Bottom Sheet Component
function PremiumUnlockSheet({ isOpen, onClose, onUpgrade, language }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onUpgrade: () => void;
  language: 'pt' | 'es';
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white/95 backdrop-blur-xl rounded-t-[32px] w-full max-w-2xl p-8 shadow-[0_6px_24px_rgba(0,0,0,0.12)] animate-slide-up border-t border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-[#111827]">
            {language === 'pt' ? 'Conteúdo Premium' : 'Contenido Premium'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#A8B5FF]/10 rounded-full transition-all duration-200"
          >
            <X className="w-6 h-6 text-[#4B5563]" />
          </button>
        </div>

        <div className="mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#A8B5FF] to-[#8B7FFF] rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_6px_24px_rgba(168,181,255,0.3)]">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <p className="text-center text-[#4B5563] text-base">
            {language === 'pt' 
              ? 'Desbloqueia para ver e partilhar todas as frases premium.' 
              : 'Desbloquea para ver y compartir todas las frases premium.'}
          </p>
        </div>

        <button
          onClick={onUpgrade}
          className="w-full bg-gradient-to-r from-[#A8B5FF] to-[#8B7FFF] text-white py-4 rounded-[20px] font-bold text-base shadow-[0_6px_24px_rgba(168,181,255,0.3)] hover:shadow-[0_8px_32px_rgba(168,181,255,0.4)] transition-all duration-200 hover:scale-[1.02]"
        >
          {language === 'pt' ? 'Quero ser Pro' : 'Quiero ser Pro'}
        </button>
      </div>
    </div>
  );
}

// Toast Message Component
function ToastMessage({ message, isVisible }: { message: string; isVisible: boolean }) {
  if (!isVisible) return null;

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
      <div className="bg-[#111827]/90 backdrop-blur-xl text-white px-6 py-3 rounded-full shadow-[0_6px_24px_rgba(0,0,0,0.2)] max-w-md text-center border border-white/10">
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}

export default function MotivaApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
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

  const showToastMessage = (message: string, duration: number = 3000) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      setToastMessage('');
    }, duration);
  };

  const handleShare = async (quoteText?: string, isPremium?: boolean) => {
    // Block if premium and not pro
    if (isPremium && !isPro) {
      showToastMessage(
        language === 'pt' 
          ? 'Esta frase é conteúdo Premium. Ativa o Pro para poder partilhar.' 
          : 'Esta frase es contenido Premium. Activa Pro para poder compartir.'
      );
      return;
    }

    const textToShare = quoteText || dailyQuote?.text;
    if (!textToShare) return;

    const result = await shareQuote(`${textToShare} — Motiva`);
    
    if (result === 'shared') {
      showToastMessage(
        language === 'pt' ? 'Frase partilhada com sucesso.' : 'Frase compartida con éxito.',
        2000
      );
    } else if (result === 'copied') {
      showToastMessage(
        language === 'pt' 
          ? 'Frase copiada para a área de transferência. Cola onde quiseres partilhar.' 
          : 'Frase copiada al portapapeles. Pégala donde quieras compartir.'
      );
    } else if (result === 'unavailable') {
      showToastMessage(
        language === 'pt' 
          ? 'Partilha/cópia não estão disponíveis neste ambiente. Testa num browser ou dispositivo real.' 
          : 'Compartir/copiar no están disponibles en este entorno. Prueba en un navegador o dispositivo real.'
      );
    } else {
      showToastMessage(
        language === 'pt' 
          ? 'Não foi possível partilhar. Tenta novamente mais tarde.' 
          : 'No se pudo compartir. Inténtalo de nuevo más tarde.'
      );
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
      <div className="min-h-screen bg-gradient-to-b from-[#A8B5FF] via-[#E8E9FF] to-white flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white tracking-tight mb-3 drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)]">
            Motiva
          </h1>
          <p className="text-sm text-white/80 mb-8">A tua dose diária de motivação</p>
          <div className="animate-pulse text-white/60 text-sm">A carregar...</div>
        </div>
      </div>
    );
  }

  // Welcome Screen
  if (currentScreen === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#A8B5FF] via-[#E8E9FF] to-white flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-16 max-w-md w-full">
          {/* Logo e Tagline */}
          <div className="space-y-4">
            <h1 className="text-6xl font-bold text-white tracking-tight drop-shadow-[0_2px_12px_rgba(255,255,255,0.4)]">
              Motiva
            </h1>
            <p className="text-base text-white/80">A tua dose diária de motivação</p>
          </div>

          {/* Seleção de Idioma */}
          <div className="space-y-6 pt-8">
            <p className="text-white font-semibold text-lg">Escolhe o teu idioma</p>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => handleLanguageSelect('pt')}
                className="flex flex-col items-center gap-3 p-8 rounded-[24px] bg-white/90 backdrop-blur-xl border border-white/40 hover:bg-white hover:shadow-[0_6px_24px_rgba(168,181,255,0.2)] transition-all duration-300 min-w-[140px] hover:scale-105"
              >
                <span className="text-5xl">🇵🇹</span>
                <span className="text-base font-bold text-[#111827]">Português</span>
              </button>

              <button
                onClick={() => handleLanguageSelect('es')}
                className="flex flex-col items-center gap-3 p-8 rounded-[24px] bg-white/90 backdrop-blur-xl border border-white/40 hover:bg-white hover:shadow-[0_6px_24px_rgba(168,181,255,0.2)] transition-all duration-300 min-w-[140px] hover:scale-105"
              >
                <span className="text-5xl">🇪🇸</span>
                <span className="text-base font-bold text-[#111827]">Español</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Screen - REDESIGN PREMIUM COMPLETO
  if (currentScreen === 'main') {
    const isQuotePremium = dailyQuote?.is_premium && !isPro;

    return (
      <div className="min-h-screen bg-[#F8F9FF] flex flex-col">
        {/* Toast Message */}
        <ToastMessage message={toastMessage} isVisible={showToast} />

        {/* Header Premium - Gradiente Suave, Título Grande com Glow */}
        <div 
          className="relative pt-20 pb-32 px-6"
          style={{
            background: 'linear-gradient(180deg, #9FA8FF 0%, #C8CEFF 40%, #E4E8FF 100%)',
            borderBottomLeftRadius: '32px',
            borderBottomRightRadius: '32px',
          }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h1 
              className="text-[64px] font-extrabold text-white tracking-tight mb-3"
              style={{
                fontWeight: 800,
                textShadow: '0 0 28px rgba(255, 255, 255, 0.5), 0 4px 24px rgba(255, 255, 255, 0.4), 0 8px 40px rgba(159, 168, 255, 0.35)',
              }}
            >
              Motiva
            </h1>
            <p className="text-base text-white/60 font-medium">
              A tua dose diária de motivação
            </p>
          </div>
        </div>

        {/* Card "Frase do Dia" - Glassmorphism Premium, Bordas 30px, Blur Forte */}
        <div className="flex-1 px-6 -mt-24 pb-28">
          <div className="max-w-2xl mx-auto">
            {quoteLoading ? (
              <div 
                className="rounded-[30px] p-16 md:p-20 animate-pulse border"
                style={{
                  background: 'rgba(255, 255, 255, 0.55)',
                  backdropFilter: 'blur(22px)',
                  WebkitBackdropFilter: 'blur(22px)',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08), 0 4px 14px rgba(0, 0, 0, 0.05)',
                }}
              >
                <div className="h-4 bg-[#E8E9FF] rounded-full w-32 mb-10"></div>
                <div className="space-y-5">
                  <div className="h-6 bg-[#E8E9FF] rounded-full"></div>
                  <div className="h-6 bg-[#E8E9FF] rounded-full"></div>
                  <div className="h-6 bg-[#E8E9FF] rounded-full w-3/4"></div>
                </div>
              </div>
            ) : dailyQuote ? (
              <div 
                className="rounded-[30px] p-16 md:p-20 border"
                style={{
                  background: 'rgba(255, 255, 255, 0.55)',
                  backdropFilter: 'blur(22px)',
                  WebkitBackdropFilter: 'blur(22px)',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08), 0 4px 14px rgba(0, 0, 0, 0.05)',
                }}
              >
                {/* Título "FRASE DO DIA" - Tracking Aumentado */}
                <div className="flex items-center justify-between mb-12">
                  <p 
                    className="text-xs font-bold uppercase"
                    style={{ 
                      color: '#6D63FF',
                      letterSpacing: '0.18em'
                    }}
                  >
                    {translations.daily}
                  </p>
                  <div className="flex items-center gap-2">
                    {dailyQuote.isFallback && (
                      <span className="text-xs bg-orange-100 text-orange-600 px-3 py-1.5 rounded-full font-semibold">
                        (PT)
                      </span>
                    )}
                    {isQuotePremium && (
                      <span className="flex items-center gap-1.5 text-xs bg-purple-100 text-[#A8B5FF] px-3 py-1.5 rounded-full font-semibold">
                        <Crown className="w-3.5 h-3.5" />
                        Premium
                      </span>
                    )}
                  </div>
                </div>
                
                {isQuotePremium ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#E8E9FF] to-[#F7F7FA] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_4px_16px_rgba(168,181,255,0.15)]">
                      <Lock className="w-10 h-10 text-[#A8B5FF]" />
                    </div>
                    <p className="text-lg text-[#4B5563] mb-8 font-medium">
                      {language === 'pt' 
                        ? 'Conteúdo premium bloqueado' 
                        : 'Contenido premium bloqueado'}
                    </p>
                    <button
                      onClick={() => setShowPremiumSheet(true)}
                      className="px-10 py-4 rounded-[20px] font-bold text-white transition-all duration-200 hover:scale-[1.02]"
                      style={{
                        background: '#6D63FF',
                        boxShadow: '0 8px 24px rgba(109, 99, 255, 0.4)',
                      }}
                    >
                      {language === 'pt' ? 'Desbloquear Pro' : 'Desbloquear Pro'}
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Frase - Tipografia Melhorada, Mais Legível */}
                    <p 
                      className="text-[22px] md:text-[24px] font-semibold text-[#111827] mb-4"
                      style={{
                        lineHeight: '1.6',
                      }}
                    >
                      "{dailyQuote.text}"
                    </p>

                    {/* Categoria - Menor Opacidade (60%), Espaçamento Acima */}
                    <p className="text-sm text-[#4B5563]/60 mb-14 capitalize font-medium mt-10">
                      {dailyQuote.category}
                    </p>

                    {/* Botões - Ícones Maiores, Animação Suave, Sombras Profundas */}
                    <div className="flex gap-3 justify-center flex-wrap">
                      {/* Botão "Ouvir" - Principal Destacado */}
                      <button
                        onClick={() => handleListen()}
                        className="flex items-center gap-3 px-10 py-4 text-white rounded-[20px] transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] font-semibold"
                        style={{
                          background: '#6D63FF',
                          boxShadow: '0 8px 24px rgba(109, 99, 255, 0.4), 0 3px 10px rgba(109, 99, 255, 0.25)',
                        }}
                      >
                        <Volume2 className="w-6 h-6" strokeWidth={2.5} />
                        <span>{t.listen}</span>
                      </button>

                      {/* Botão "Partilhar" - Outline Premium */}
                      <button
                        onClick={() => handleShare()}
                        className="flex items-center gap-3 px-10 py-4 bg-white text-[#111827] rounded-[20px] transition-all duration-200 hover:bg-[#F7F7FA] hover:scale-[1.03] active:scale-[0.98] font-semibold"
                        style={{
                          border: '2px solid #E0E0E7',
                          boxShadow: '0 6px 18px rgba(0, 0, 0, 0.07), 0 2px 8px rgba(0, 0, 0, 0.05)',
                        }}
                      >
                        <Share2 className="w-6 h-6" strokeWidth={2.5} />
                        <span>{t.share}</span>
                      </button>

                      {/* Botão "Favoritar" - Outline Premium */}
                      <button
                        onClick={() => handleFavorite(dailyQuote.id)}
                        className={`flex items-center gap-3 px-10 py-4 rounded-[20px] transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] font-semibold ${
                          isFavorite(dailyQuote.id)
                            ? 'bg-red-50 text-red-600'
                            : 'bg-white text-[#111827] hover:bg-[#F7F7FA]'
                        }`}
                        style={{
                          border: isFavorite(dailyQuote.id) ? '2px solid #FCA5A5' : '2px solid #E0E0E7',
                          boxShadow: '0 6px 18px rgba(0, 0, 0, 0.07), 0 2px 8px rgba(0, 0, 0, 0.05)',
                        }}
                      >
                        <Heart className={`w-6 h-6 ${isFavorite(dailyQuote.id) ? 'fill-current' : ''}`} strokeWidth={2.5} />
                      </button>
                    </div>
                  </>
                )}

                {/* DEV ONLY: Refresh Day Button */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={handleRefreshDay}
                      className="text-xs text-[#4B5563] hover:text-[#111827] flex items-center gap-1 mx-auto"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Atualizar dia (dev)</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div 
                className="rounded-[30px] p-16 md:p-20 border text-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.55)',
                  backdropFilter: 'blur(22px)',
                  WebkitBackdropFilter: 'blur(22px)',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08), 0 4px 14px rgba(0, 0, 0, 0.05)',
                }}
              >
                <p className="text-[#4B5563]">
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

        {/* Bottom Navigation com glassmorphism iOS */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-white/40 p-4 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
          <div className="max-w-4xl mx-auto flex justify-around">
            <button
              onClick={() => setCurrentScreen('main')}
              className="flex flex-col items-center gap-1.5 text-[#A8B5FF] transition-all duration-150"
            >
              <div className="relative">
                <Sparkles className="w-6 h-6" strokeWidth={2.5} />
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-[#A8B5FF] rounded-full shadow-[0_0_8px_rgba(168,181,255,0.6)]"></div>
              </div>
              <span className="text-[10px] font-bold">{translations.home}</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('explore')}
              className="flex flex-col items-center gap-1.5 text-[#9CA3AF] hover:text-[#A8B5FF] transition-all duration-150"
            >
              <Target className="w-6 h-6" strokeWidth={2} />
              <span className="text-[10px] font-medium">{translations.explore}</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('favorites')}
              className="flex flex-col items-center gap-1.5 text-[#9CA3AF] hover:text-[#A8B5FF] transition-all duration-150"
            >
              <Heart className="w-6 h-6" strokeWidth={2} />
              <span className="text-[10px] font-medium">{translations.favorites}</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('premium')}
              className="flex flex-col items-center gap-1.5 text-[#9CA3AF] hover:text-[#A8B5FF] transition-all duration-150"
            >
              <Crown className="w-6 h-6" strokeWidth={2} />
              <span className="text-[10px] font-medium">{translations.premium}</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('settings')}
              className="flex flex-col items-center gap-1.5 text-[#9CA3AF] hover:text-[#A8B5FF] transition-all duration-150"
            >
              <Settings className="w-6 h-6" strokeWidth={2} />
              <span className="text-[10px] font-medium">{translations.settings}</span>
            </button>
          </div>
        </nav>
      </div>
    );
  }

  // Explore Screen - REDESIGN PREMIUM
  if (currentScreen === 'explore') {
    return (
      <div className="min-h-screen bg-[#F8F9FF] flex flex-col">
        {/* Toast Message */}
        <ToastMessage message={toastMessage} isVisible={showToast} />

        {/* Header Premium - Gradiente Suave */}
        <div 
          className="pt-16 pb-10 px-6"
          style={{
            background: 'linear-gradient(180deg, #9FA8FF 0%, #C8CEFF 50%, #E4E8FF 100%)',
            borderBottomLeftRadius: '28px',
            borderBottomRightRadius: '28px',
          }}
        >
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
              {translations.explore}
            </h1>
            <p className="text-white/70 text-base font-medium">
              {language === 'pt' ? 'Descobre novas frases por tema' : 'Descubre nuevas frases por tema'}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-24">
          {/* Category Chips - Scroll Horizontal */}
          <div className="px-6 py-6 -mt-2">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                    selectedCategory === null
                      ? 'bg-gradient-to-r from-[#A8B5FF] to-[#8B7FFF] text-white shadow-[0_4px_16px_rgba(168,181,255,0.35)]'
                      : 'bg-white text-[#111827] border-2 border-[#E0E0E7] hover:border-[#A8B5FF] hover:shadow-md'
                  }`}
                >
                  {translations.all}
                </button>
                {categoriesLoading ? (
                  <div className="px-6 py-3 bg-white rounded-full animate-pulse border-2 border-[#E0E0E7] flex-shrink-0">
                    <div className="h-4 w-20 bg-[#E8E9FF] rounded-full"></div>
                  </div>
                ) : (
                  dbCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-200 capitalize whitespace-nowrap flex-shrink-0 ${
                        selectedCategory === category
                          ? 'bg-gradient-to-r from-[#A8B5FF] to-[#8B7FFF] text-white shadow-[0_4px_16px_rgba(168,181,255,0.35)]'
                          : 'bg-white text-[#111827] border-2 border-[#E0E0E7] hover:border-[#A8B5FF] hover:shadow-md'
                      }`}
                    >
                      {category}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Quotes List - Cards Elegantes */}
          <div className="px-6">
            <div className="max-w-4xl mx-auto space-y-4">
              {categoryLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div 
                      key={i} 
                      className="rounded-[24px] p-6 animate-pulse border"
                      style={{
                        background: 'rgba(255, 255, 255, 0.7)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        borderColor: 'rgba(255, 255, 255, 0.4)',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
                      }}
                    >
                      <div className="h-6 bg-[#E8E9FF] rounded-full w-3/4 mb-3"></div>
                      <div className="h-4 bg-[#E8E9FF] rounded-full w-1/4"></div>
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
                      className={`rounded-[24px] p-6 border transition-all duration-200 ${
                        isQuotePremium ? 'cursor-pointer' : ''
                      }`}
                      style={{
                        background: 'rgba(255, 255, 255, 0.7)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        borderColor: 'rgba(255, 255, 255, 0.4)',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.06)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <div className="flex-1">
                          {isQuotePremium ? (
                            <div className="flex items-center gap-3">
                              <Lock className="w-5 h-5 text-[#9CA3AF] flex-shrink-0" />
                              <p className="text-base text-[#9CA3AF] blur-[3px] select-none font-medium">
                                "{quote.text.substring(0, 50)}..."
                              </p>
                            </div>
                          ) : (
                            <p className="text-base text-[#111827] font-medium leading-relaxed">
                              "{quote.text}"
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {quote.is_premium && (
                            <span className="flex items-center gap-1 text-xs bg-purple-100 text-[#A8B5FF] px-2.5 py-1.5 rounded-full font-bold">
                              <Crown className="w-3.5 h-3.5" />
                            </span>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFavorite(quote.id, quote.is_premium);
                            }}
                            disabled={isQuotePremium}
                            className={`p-2.5 rounded-full transition-all duration-150 ${
                              isQuotePremium
                                ? 'text-[#E5E7EB] cursor-not-allowed'
                                : isFavorite(quote.id)
                                ? 'text-red-600 bg-red-50 hover:bg-red-100'
                                : 'text-[#9CA3AF] hover:text-red-600 hover:bg-red-50'
                            }`}
                          >
                            <Heart className={`w-5 h-5 ${isFavorite(quote.id) && !isQuotePremium ? 'fill-current' : ''}`} strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>

                      {/* Categoria e Idioma */}
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-xs text-[#4B5563]/70 capitalize font-semibold">
                          {quote.category}
                        </p>
                        <span className="text-xs bg-[#E8E9FF] text-[#6D63FF] px-3 py-1 rounded-full font-bold">
                          {language === 'pt' ? 'PT' : 'ES'}
                        </span>
                      </div>

                      {/* Action buttons for non-premium quotes */}
                      {!isQuotePremium && (
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleListen(quote.text);
                            }}
                            className="flex items-center gap-2 px-5 py-2.5 bg-[#E8E9FF] text-[#6D63FF] rounded-full text-sm border-2 border-[#6D63FF]/10 hover:bg-[#6D63FF] hover:text-white transition-all duration-150 font-bold"
                          >
                            <Volume2 className="w-4 h-4" strokeWidth={2.5} />
                            <span>{t.listen}</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(quote.text, quote.is_premium);
                            }}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#111827] rounded-full text-sm border-2 border-[#E0E0E7] hover:border-[#A8B5FF] hover:shadow-md transition-all duration-150 font-bold"
                          >
                            <Share2 className="w-4 h-4" strokeWidth={2.5} />
                            <span>{t.share}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                // Empty State
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#E8E9FF] to-[#F7F7FA] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_4px_16px_rgba(168,181,255,0.15)]">
                    <Target className="w-10 h-10 text-[#A8B5FF]" strokeWidth={2} />
                  </div>
                  <p className="text-lg text-[#4B5563] font-medium">
                    {language === 'pt' 
                      ? 'Ainda não há frases neste tema. Experimenta outra categoria!' 
                      : '¡Aún no hay frases en este tema. Prueba otra categoría!'}
                  </p>
                </div>
              )}
            </div>
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
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-white/40 p-4 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
          <div className="max-w-4xl mx-auto flex justify-around">
            <button
              onClick={() => setCurrentScreen('main')}
              className="flex flex-col items-center gap-1.5 text-[#9CA3AF] hover:text-[#A8B5FF] transition-all duration-150"
            >
              <Sparkles className="w-6 h-6" strokeWidth={2} />
              <span className="text-[10px] font-medium">{translations.home}</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('explore')}
              className="flex flex-col items-center gap-1.5 text-[#A8B5FF] transition-all duration-150"
            >
              <div className="relative">
                <Target className="w-6 h-6" strokeWidth={2.5} />
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-[#A8B5FF] rounded-full shadow-[0_0_8px_rgba(168,181,255,0.6)]"></div>
              </div>
              <span className="text-[10px] font-bold">{translations.explore}</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('favorites')}
              className="flex flex-col items-center gap-1.5 text-[#9CA3AF] hover:text-[#A8B5FF] transition-all duration-150"
            >
              <Heart className="w-6 h-6" strokeWidth={2} />
              <span className="text-[10px] font-medium">{translations.favorites}</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('premium')}
              className="flex flex-col items-center gap-1.5 text-[#9CA3AF] hover:text-[#A8B5FF] transition-all duration-150"
            >
              <Crown className="w-6 h-6" strokeWidth={2} />
              <span className="text-[10px] font-medium">{translations.premium}</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('settings')}
              className="flex flex-col items-center gap-1.5 text-[#9CA3AF] hover:text-[#A8B5FF] transition-all duration-150"
            >
              <Settings className="w-6 h-6" strokeWidth={2} />
              <span className="text-[10px] font-medium">{translations.settings}</span>
            </button>
          </div>
        </nav>
      </div>
    );
  }

  // Favorites Screen - REDESIGN PREMIUM
  if (currentScreen === 'favorites') {
    return (
      <div className="min-h-screen bg-[#F8F9FF] flex flex-col">
        {/* Toast Message */}
        <ToastMessage message={toastMessage} isVisible={showToast} />

        {/* Header Premium - Gradiente Suave */}
        <div 
          className="pt-16 pb-10 px-6"
          style={{
            background: 'linear-gradient(180deg, #9FA8FF 0%, #C8CEFF 50%, #E4E8FF 100%)',
            borderBottomLeftRadius: '28px',
            borderBottomRightRadius: '28px',
          }}
        >
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
              {translations.favorites}
            </h1>
            <p className="text-white/70 text-base font-medium">
              {language === 'pt' 
                ? 'As frases que guardaste para voltar a ler' 
                : 'Las frases que guardaste para volver a leer'}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-24">
          {favoriteQuotes.length === 0 ? (
            // Empty State Premium
            <div className="px-6 py-20">
              <div className="max-w-md mx-auto text-center">
                <div className="w-28 h-28 bg-gradient-to-br from-[#E8E9FF] to-[#F7F7FA] rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_8px_32px_rgba(168,181,255,0.2)]">
                  <Heart className="w-14 h-14 text-[#A8B5FF]" strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-bold text-[#111827] mb-3">
                  {language === 'pt' 
                    ? 'Ainda não tens frases favoritas' 
                    : 'Aún no tienes frases favoritas'}
                </h3>
                <p className="text-[#4B5563] text-base mb-8 leading-relaxed">
                  {language === 'pt' 
                    ? 'Toca no coração numa frase para a guardares aqui.' 
                    : 'Toca el corazón en una frase para guardarla aquí.'}
                </p>
                <button
                  onClick={() => setCurrentScreen('explore')}
                  className="px-8 py-4 bg-gradient-to-r from-[#A8B5FF] to-[#8B7FFF] text-white rounded-[20px] font-bold text-base shadow-[0_6px_24px_rgba(168,181,255,0.3)] hover:shadow-[0_8px_32px_rgba(168,181,255,0.4)] transition-all duration-200 hover:scale-[1.02]"
                >
                  {language === 'pt' ? 'Explorar Frases' : 'Explorar Frases'}
                </button>
              </div>
            </div>
          ) : (
            // Lista de Favoritos - Cards Premium com Destaque
            <div className="px-6 py-6">
              <div className="max-w-4xl mx-auto space-y-4">
                {favoriteQuotes.map((quote) => (
                  <div
                    key={quote.id}
                    className="rounded-[24px] p-6 border transition-all duration-200"
                    style={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      borderColor: 'rgba(168, 181, 255, 0.2)',
                      boxShadow: '0 6px 20px rgba(168, 181, 255, 0.15), 0 2px 8px rgba(0, 0, 0, 0.05)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 10px 32px rgba(168, 181, 255, 0.25), 0 4px 12px rgba(0, 0, 0, 0.08)';
                      e.currentTarget.style.transform = 'translateY(-3px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(168, 181, 255, 0.15), 0 2px 8px rgba(0, 0, 0, 0.05)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <div className="flex-1">
                        <p className="text-base text-[#111827] font-medium leading-relaxed">
                          "{quote.text}"
                        </p>
                      </div>
                      
                      {/* Coração Cheio Visível */}
                      <button
                        onClick={() => toggleFavorite(quote.id)}
                        className="p-2.5 rounded-full text-red-600 bg-red-50 hover:bg-red-100 transition-all duration-150 hover:scale-110 active:scale-95"
                      >
                        <Heart className="w-5 h-5 fill-current" strokeWidth={2.5} />
                      </button>
                    </div>

                    {/* Categoria e Idioma Discretos */}
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs text-[#4B5563]/70 capitalize font-semibold">
                        {quote.category}
                      </p>
                      <span className="text-xs bg-[#E8E9FF] text-[#6D63FF] px-3 py-1 rounded-full font-bold">
                        {language === 'pt' ? 'PT' : 'ES'}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleListen(quote.text)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#E8E9FF] text-[#6D63FF] rounded-full text-sm border-2 border-[#6D63FF]/10 hover:bg-[#6D63FF] hover:text-white transition-all duration-150 font-bold hover:scale-105 active:scale-95"
                      >
                        <Volume2 className="w-4 h-4" strokeWidth={2.5} />
                        <span>{t.listen}</span>
                      </button>
                      <button
                        onClick={() => handleShare(quote.text, quote.is_premium)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#111827] rounded-full text-sm border-2 border-[#E0E0E7] hover:border-[#A8B5FF] hover:shadow-md transition-all duration-150 font-bold hover:scale-105 active:scale-95"
                      >
                        <Share2 className="w-4 h-4" strokeWidth={2.5} />
                        <span>{t.share}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-white/40 p-4 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
          <div className="max-w-4xl mx-auto flex justify-around">
            <button
              onClick={() => setCurrentScreen('main')}
              className="flex flex-col items-center gap-1.5 text-[#9CA3AF] hover:text-[#A8B5FF] transition-all duration-150"
            >
              <Sparkles className="w-6 h-6" strokeWidth={2} />
              <span className="text-[10px] font-medium">{translations.home}</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('explore')}
              className="flex flex-col items-center gap-1.5 text-[#9CA3AF] hover:text-[#A8B5FF] transition-all duration-150"
            >
              <Target className="w-6 h-6" strokeWidth={2} />
              <span className="text-[10px] font-medium">{translations.explore}</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('favorites')}
              className="flex flex-col items-center gap-1.5 text-[#A8B5FF] transition-all duration-150"
            >
              <div className="relative">
                <Heart className="w-6 h-6" strokeWidth={2.5} />
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-[#A8B5FF] rounded-full shadow-[0_0_8px_rgba(168,181,255,0.6)]"></div>
              </div>
              <span className="text-[10px] font-bold">{translations.favorites}</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('premium')}
              className="flex flex-col items-center gap-1.5 text-[#9CA3AF] hover:text-[#A8B5FF] transition-all duration-150"
            >
              <Crown className="w-6 h-6" strokeWidth={2} />
              <span className="text-[10px] font-medium">{translations.premium}</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('settings')}
              className="flex flex-col items-center gap-1.5 text-[#9CA3AF] hover:text-[#A8B5FF] transition-all duration-150"
            >
              <Settings className="w-6 h-6" strokeWidth={2} />
              <span className="text-[10px] font-medium">{translations.settings}</span>
            </button>
          </div>
        </nav>
      </div>
    );
  }

  // Premium Screen - REDESIGN PROFISSIONAL COMPLETO
  if (currentScreen === 'premium') {
    return (
      <div className="min-h-screen bg-[#F8F9FF] flex flex-col">
        {/* Header Premium - Gradiente Suave com Título e Subtítulo */}
        <div 
          className="pt-16 pb-16 px-6"
          style={{
            background: 'linear-gradient(180deg, #9FA8FF 0%, #C8CEFF 50%, #E4E8FF 100%)',
            borderBottomLeftRadius: '32px',
            borderBottomRightRadius: '32px',
          }}
        >
          <div className="max-w-4xl mx-auto text-center">
            {/* Ícone Crown Premium */}
            <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_8px_32px_rgba(168,181,255,0.3)]">
              <Crown className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
            
            <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">
              Motiva Premium
            </h1>
            <p className="text-xl text-white/80 font-medium">
              Mais foco. Mais disciplina. Mais motivação.
            </p>
          </div>
        </div>

        {/* Conteúdo Principal - Cards de Benefícios */}
        <div className="flex-1 overflow-y-auto pb-24 px-6 py-10">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Card 1 - Frases Exclusivas */}
            <div 
              className="rounded-[28px] p-8 border transition-all duration-200 hover:scale-[1.02]"
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderColor: 'rgba(168, 181, 255, 0.2)',
                boxShadow: '0 6px 20px rgba(168, 181, 255, 0.15)',
              }}
            >
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 bg-gradient-to-br from-[#A8B5FF] to-[#8B7FFF] rounded-[20px] flex items-center justify-center flex-shrink-0 shadow-[0_6px_20px_rgba(168,181,255,0.3)]">
                  <Star className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#111827] mb-3">
                    Frases exclusivas Premium
                  </h3>
                  <p className="text-base text-[#4B5563] leading-relaxed">
                    Acede a centenas de frases motivacionais exclusivas, cuidadosamente selecionadas para te inspirar todos os dias.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 - Categorias Extra */}
            <div 
              className="rounded-[28px] p-8 border transition-all duration-200 hover:scale-[1.02]"
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderColor: 'rgba(168, 181, 255, 0.2)',
                boxShadow: '0 6px 20px rgba(168, 181, 255, 0.15)',
              }}
            >
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 bg-gradient-to-br from-[#A8B5FF] to-[#8B7FFF] rounded-[20px] flex items-center justify-center flex-shrink-0 shadow-[0_6px_20px_rgba(168,181,255,0.3)]">
                  <Target className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#111827] mb-3">
                    Categorias extra focadas em produtividade
                  </h3>
                  <p className="text-base text-[#4B5563] leading-relaxed">
                    Explora temas especiais como foco profundo, gestão de tempo, hábitos vencedores e muito mais.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 - Atualizações Diárias */}
            <div 
              className="rounded-[28px] p-8 border transition-all duration-200 hover:scale-[1.02]"
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderColor: 'rgba(168, 181, 255, 0.2)',
                boxShadow: '0 6px 20px rgba(168, 181, 255, 0.15)',
              }}
            >
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 bg-gradient-to-br from-[#A8B5FF] to-[#8B7FFF] rounded-[20px] flex items-center justify-center flex-shrink-0 shadow-[0_6px_20px_rgba(168,181,255,0.3)]">
                  <Sparkles className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#111827] mb-3">
                    Novas frases todos os dias
                  </h3>
                  <p className="text-base text-[#4B5563] leading-relaxed">
                    Recebe conteúdo fresco diariamente. Nunca mais fiques sem inspiração para começar o teu dia com energia.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 4 - Sem Anúncios */}
            <div 
              className="rounded-[28px] p-8 border transition-all duration-200 hover:scale-[1.02]"
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderColor: 'rgba(168, 181, 255, 0.2)',
                boxShadow: '0 6px 20px rgba(168, 181, 255, 0.15)',
              }}
            >
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 bg-gradient-to-br from-[#A8B5FF] to-[#8B7FFF] rounded-[20px] flex items-center justify-center flex-shrink-0 shadow-[0_6px_20px_rgba(168,181,255,0.3)]">
                  <Zap className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#111827] mb-3">
                    Experiência sem interrupções
                  </h3>
                  <p className="text-base text-[#4B5563] leading-relaxed">
                    Desfruta de uma experiência premium sem anúncios, notificações intrusivas ou distrações.
                  </p>
                </div>
              </div>
            </div>

            {/* Call to Action - Botão Principal */}
            <div className="pt-6">
              <button
                onClick={() => {
                  console.log('Botão Premium clicado - Em breve!');
                  showToastMessage(
                    language === 'pt' 
                      ? 'Em breve! Aguarda novidades sobre o Motiva Premium.' 
                      : '¡Próximamente! Espera novedades sobre Motiva Premium.',
                    3000
                  );
                }}
                className="w-full py-5 rounded-[24px] font-bold text-lg text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, #A8B5FF 0%, #8B7FFF 100%)',
                  boxShadow: '0 10px 32px rgba(168, 181, 255, 0.4), 0 4px 16px rgba(168, 181, 255, 0.3)',
                }}
              >
                {language === 'pt' ? 'Quero ser notificado' : 'Quiero ser notificado'}
              </button>
              
              <p className="text-center text-sm text-[#4B5563] mt-4">
                {language === 'pt' 
                  ? 'Sem compromisso. Cancela quando quiseres.' 
                  : 'Sin compromiso. Cancela cuando quieras.'}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-white/40 p-4 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
          <div className="max-w-4xl mx-auto flex justify-around">
            <button
              onClick={() => setCurrentScreen('main')}
              className="flex flex-col items-center gap-1.5 text-[#9CA3AF] hover:text-[#A8B5FF] transition-all duration-150"
            >
              <Sparkles className="w-6 h-6" strokeWidth={2} />
              <span className="text-[10px] font-medium">{translations.home}</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('explore')}
              className="flex flex-col items-center gap-1.5 text-[#9CA3AF] hover:text-[#A8B5FF] transition-all duration-150"
            >
              <Target className="w-6 h-6" strokeWidth={2} />
              <span className="text-[10px] font-medium">{translations.explore}</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('favorites')}
              className="flex flex-col items-center gap-1.5 text-[#9CA3AF] hover:text-[#A8B5FF] transition-all duration-150"
            >
              <Heart className="w-6 h-6" strokeWidth={2} />
              <span className="text-[10px] font-medium">{translations.favorites}</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('premium')}
              className="flex flex-col items-center gap-1.5 text-[#A8B5FF] transition-all duration-150"
            >
              <div className="relative">
                <Crown className="w-6 h-6" strokeWidth={2.5} />
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-[#A8B5FF] rounded-full shadow-[0_0_8px_rgba(168,181,255,0.6)]"></div>
              </div>
              <span className="text-[10px] font-bold">{translations.premium}</span>
            </button>
            
            <button
              onClick={() => setCurrentScreen('settings')}
              className="flex flex-col items-center gap-1.5 text-[#9CA3AF] hover:text-[#A8B5FF] transition-all duration-150"
            >
              <Settings className="w-6 h-6" strokeWidth={2} />
              <span className="text-[10px] font-medium">{translations.settings}</span>
            </button>
          </div>
        </nav>
      </div>
    );
  }

  // Settings Screen - REDESIGN PREMIUM
  return (
    <div className="min-h-screen bg-[#F8F9FF] flex flex-col">
      {/* Header Premium - Gradiente Suave */}
      <div 
        className="pt-16 pb-10 px-6"
        style={{
          background: 'linear-gradient(180deg, #9FA8FF 0%, #C8CEFF 50%, #E4E8FF 100%)',
          borderBottomLeftRadius: '28px',
          borderBottomRightRadius: '28px',
        }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            {translations.settings}
          </h1>
          <p className="text-white/70 text-base font-medium">
            {language === 'pt' 
              ? 'Personaliza a tua experiência na Motiva' 
              : 'Personaliza tu experiencia en Motiva'}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24 px-6 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Secção de Idioma - Cards com Bandeira */}
          <div>
            <h2 className="text-sm font-bold text-[#4B5563] uppercase tracking-wider mb-4 px-2">
              {language === 'pt' ? 'Idioma' : 'Idioma'}
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Card Português */}
              <button
                onClick={() => handleLanguageChange('pt')}
                className={`rounded-[24px] p-6 border-2 transition-all duration-200 hover:scale-[1.02] ${
                  language === 'pt'
                    ? 'border-[#A8B5FF] bg-gradient-to-br from-[#A8B5FF]/10 to-[#8B7FFF]/5'
                    : 'border-[#E0E0E7] bg-white/80 hover:border-[#A8B5FF]/50'
                }`}
                style={{
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  boxShadow: language === 'pt' 
                    ? '0 6px 20px rgba(168, 181, 255, 0.2)' 
                    : '0 4px 16px rgba(0, 0, 0, 0.06)',
                }}
              >
                <div className="flex flex-col items-center gap-3">
                  <span className="text-5xl">🇵🇹</span>
                  <span className={`text-base font-bold ${
                    language === 'pt' ? 'text-[#6D63FF]' : 'text-[#111827]'
                  }`}>
                    Português
                  </span>
                  {language === 'pt' && (
                    <div className="w-2 h-2 bg-[#A8B5FF] rounded-full shadow-[0_0_8px_rgba(168,181,255,0.6)]"></div>
                  )}
                </div>
              </button>

              {/* Card Español */}
              <button
                onClick={() => handleLanguageChange('es')}
                className={`rounded-[24px] p-6 border-2 transition-all duration-200 hover:scale-[1.02] ${
                  language === 'es'
                    ? 'border-[#A8B5FF] bg-gradient-to-br from-[#A8B5FF]/10 to-[#8B7FFF]/5'
                    : 'border-[#E0E0E7] bg-white/80 hover:border-[#A8B5FF]/50'
                }`}
                style={{
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  boxShadow: language === 'es' 
                    ? '0 6px 20px rgba(168, 181, 255, 0.2)' 
                    : '0 4px 16px rgba(0, 0, 0, 0.06)',
                }}
              >
                <div className="flex flex-col items-center gap-3">
                  <span className="text-5xl">🇪🇸</span>
                  <span className={`text-base font-bold ${
                    language === 'es' ? 'text-[#6D63FF]' : 'text-[#111827]'
                  }`}>
                    Español
                  </span>
                  {language === 'es' && (
                    <div className="w-2 h-2 bg-[#A8B5FF] rounded-full shadow-[0_0_8px_rgba(168,181,255,0.6)]"></div>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Secção Geral */}
          <div className="pt-4">
            <h2 className="text-sm font-bold text-[#4B5563] uppercase tracking-wider mb-4 px-2">
              {language === 'pt' ? 'Geral' : 'General'}
            </h2>

            {/* Pro Toggle (Dev/Testing) */}
            <div 
              className="rounded-[24px] p-6 border mb-4"
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderColor: 'rgba(255, 255, 255, 0.4)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#E8E9FF] to-[#F7F7FA] rounded-full flex items-center justify-center shadow-[0_4px_16px_rgba(168,181,255,0.15)]">
                    <Crown className="w-7 h-7 text-[#A8B5FF]" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#111827] text-base">
                      {language === 'pt' ? 'Sou Pro' : 'Soy Pro'}
                    </h3>
                    <p className="text-sm text-[#4B5563]">
                      {language === 'pt' ? 'Ativar modo premium (teste)' : 'Activar modo premium (prueba)'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPro(!isPro)}
                  className={`relative inline-flex h-9 w-16 items-center rounded-full transition-colors duration-200 shadow-inner ${
                    isPro ? 'bg-gradient-to-r from-[#A8B5FF] to-[#8B7FFF]' : 'bg-[#E5E7EB]'
                  }`}
                >
                  <span
                    className={`inline-block h-7 w-7 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
                      isPro ? 'translate-x-8' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Notifications Setting */}
            <div 
              className="rounded-[24px] p-6 border"
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderColor: 'rgba(255, 255, 255, 0.4)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
              }}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#E8E9FF] to-[#F7F7FA] rounded-full flex items-center justify-center shadow-[0_4px_16px_rgba(168,181,255,0.15)]">
                  <Bell className="w-7 h-7 text-[#A8B5FF]" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-[#111827] text-base">{t.notifications}</h3>
                  <p className="text-sm text-[#4B5563]">
                    {language === 'pt' ? 'Receber frases diárias' : 'Recibir frases diarias'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Secção Sobre */}
          <div className="pt-4">
            <h2 className="text-sm font-bold text-[#4B5563] uppercase tracking-wider mb-4 px-2">
              {language === 'pt' ? 'Sobre' : 'Acerca de'}
            </h2>

            {/* About Setting */}
            <div 
              className="rounded-[24px] p-6 border"
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderColor: 'rgba(255, 255, 255, 0.4)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
              }}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#E8E9FF] to-[#F7F7FA] rounded-full flex items-center justify-center shadow-[0_4px_16px_rgba(168,181,255,0.15)]">
                  <Info className="w-7 h-7 text-[#A8B5FF]" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-[#111827] text-base">{t.about}</h3>
                  <p className="text-sm text-[#4B5563]">{t.version}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center py-8 text-[#4B5563] text-sm">
            <p>{t.madeWith} ❤️ {t.by}</p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-white/40 p-4 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
        <div className="max-w-4xl mx-auto flex justify-around">
          <button
            onClick={() => setCurrentScreen('main')}
            className="flex flex-col items-center gap-1.5 text-[#9CA3AF] hover:text-[#A8B5FF] transition-all duration-150"
          >
            <Sparkles className="w-6 h-6" strokeWidth={2} />
            <span className="text-[10px] font-medium">{translations.home}</span>
          </button>
          
          <button
            onClick={() => setCurrentScreen('explore')}
            className="flex flex-col items-center gap-1.5 text-[#9CA3AF] hover:text-[#A8B5FF] transition-all duration-150"
          >
            <Target className="w-6 h-6" strokeWidth={2} />
            <span className="text-[10px] font-medium">{translations.explore}</span>
          </button>
          
          <button
            onClick={() => setCurrentScreen('favorites')}
            className="flex flex-col items-center gap-1.5 text-[#9CA3AF] hover:text-[#A8B5FF] transition-all duration-150"
          >
            <Heart className="w-6 h-6" strokeWidth={2} />
            <span className="text-[10px] font-medium">{translations.favorites}</span>
          </button>
          
          <button
            onClick={() => setCurrentScreen('premium')}
            className="flex flex-col items-center gap-1.5 text-[#9CA3AF] hover:text-[#A8B5FF] transition-all duration-150"
          >
            <Crown className="w-6 h-6" strokeWidth={2} />
            <span className="text-[10px] font-medium">{translations.premium}</span>
          </button>
          
          <button
            onClick={() => setCurrentScreen('settings')}
            className="flex flex-col items-center gap-1.5 text-[#A8B5FF] transition-all duration-150"
          >
            <div className="relative">
              <Settings className="w-6 h-6" strokeWidth={2.5} />
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-[#A8B5FF] rounded-full shadow-[0_0_8px_rgba(168,181,255,0.6)]"></div>
            </div>
            <span className="text-[10px] font-bold">{translations.settings}</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
