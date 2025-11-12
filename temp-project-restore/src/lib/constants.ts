// Constants for Motiva App
import { CategoryInfo, Quote } from './types';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'foco',
    name: { pt: 'Foco', es: 'Enfoque' },
    icon: 'Target',
    color: '#5B4BFF'
  },
  {
    id: 'disciplina',
    name: { pt: 'Disciplina', es: 'Disciplina' },
    icon: 'Zap',
    color: '#FF6B6B'
  },
  {
    id: 'autoestima',
    name: { pt: 'Autoestima', es: 'Autoestima' },
    icon: 'Heart',
    color: '#FF8C42'
  },
  {
    id: 'sucesso',
    name: { pt: 'Sucesso', es: 'Éxito' },
    icon: 'TrendingUp',
    color: '#4ECDC4'
  },
  {
    id: 'fitness',
    name: { pt: 'Fitness', es: 'Fitness' },
    icon: 'Dumbbell',
    color: '#95E1D3'
  },
  {
    id: 'calma',
    name: { pt: 'Calma', es: 'Calma' },
    icon: 'Sparkles',
    color: '#A8E6CF'
  }
];

// i18n dictionary
export const i18n = {
  pt: { 
    all: "Todas", 
    explore: "Explorar", 
    daily: "Frase do Dia",
    home: "Início",
    favorites: "Favoritos",
    premium: "Premium",
    settings: "Definições"
  },
  es: { 
    all: "Todas", 
    explore: "Explorar", 
    daily: "Frase del Día",
    home: "Inicio",
    favorites: "Favoritos",
    premium: "Premium",
    settings: "Ajustes"
  }
};

export const TRANSLATIONS = {
  pt: {
    welcome: 'Bem-vindo ao Motiva',
    chooseLanguage: 'Escolha o seu idioma',
    slogan: 'A tua dose diária de motivação',
    quoteOfTheDay: 'Frase do Dia',
    listen: 'Ouvir',
    share: 'Partilhar',
    favorite: 'Favoritar',
    unfavorite: 'Remover',
    explore: 'Explorar',
    favorites: 'Favoritos',
    premium: 'Premium',
    settings: 'Definições',
    categories: 'Categorias',
    noFavorites: 'Ainda não tens frases favoritas',
    addFavorites: 'Explora e adiciona as tuas frases preferidas',
    premiumTitle: 'Motiva Premium',
    premiumFeature1: 'Sem anúncios',
    premiumFeature2: 'Frases exclusivas',
    premiumFeature3: 'Áudio diário',
    subscribe: 'Subscrever Premium',
    language: 'Idioma',
    notifications: 'Notificações',
    about: 'Sobre',
    version: 'Versão 1.0.0',
    madeWith: 'Feito com',
    by: 'por Lasy AI'
  },
  es: {
    welcome: 'Bienvenido a Motiva',
    chooseLanguage: 'Elige tu idioma',
    slogan: 'Tu dosis diaria de motivación',
    quoteOfTheDay: 'Frase del Día',
    listen: 'Escuchar',
    share: 'Compartir',
    favorite: 'Favorito',
    unfavorite: 'Quitar',
    explore: 'Explorar',
    favorites: 'Favoritos',
    premium: 'Premium',
    settings: 'Ajustes',
    categories: 'Categorías',
    noFavorites: 'Aún no tienes frases favoritas',
    addFavorites: 'Explora y añade tus frases preferidas',
    premiumTitle: 'Motiva Premium',
    premiumFeature1: 'Sin anuncios',
    premiumFeature2: 'Frases exclusivas',
    premiumFeature3: 'Audio diario',
    subscribe: 'Suscribirse a Premium',
    language: 'Idioma',
    notifications: 'Notificaciones',
    about: 'Acerca de',
    version: 'Versión 1.0.0',
    madeWith: 'Hecho con',
    by: 'por Lasy AI'
  }
};
