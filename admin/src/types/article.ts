export interface ArticleCategory {
  id: number;
  nom: string;
  description: string;
}

export interface Article {
  id: number;
  titre: string;
  contenu: string;
  publie: boolean;
  date: string;
  categories?: ArticleCategory[];
}
