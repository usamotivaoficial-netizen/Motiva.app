// Types for Motiva App

export type Language = 'pt' | 'es';

export type Category = 'foco' | 'disciplina' | 'autoestima' | 'sucesso' | 'fitness' | 'calma';

export interface Quote {
  id: string;
  text: {
    pt: string;
    es: string;
  };
  category: Category;
  isPremium?: boolean;
}

export interface CategoryInfo {
  id: Category;
  name: {
    pt: string;
    es: string;
  };
  icon: string;
  color: string;
}
