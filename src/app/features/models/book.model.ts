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
