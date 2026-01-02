export interface Book {
  _id: string;
  title: string;
  cover_url: string;
  author_id: string;
  category_id: string;
  published_date: null;
  price: { $numberDecimal: string };
  total_copies: number;
  description: string | null;
  available_copies: number;
  author_name: string;
  category_name: string;
}

export interface BookItem {
  title: string;
  author_id: string;
  category_id: string;
  published_date: string | null;
  price: { $numberDecimal: string } | number;
  total_copies?: number;
  description: string | null;
  cover_url: string;
}

export interface RemoveBookI {
  _id: string;
  title: string;
  cover_url: string;
  total_copies: number;
  deleted_copies: number;
  deleted_at: string;
}
