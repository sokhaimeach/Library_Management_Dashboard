export interface AuthorI {
  _id: string;
  name: string;
  birth_date: { $date: string };
  nationality: string;
  biography: string;
}


export interface AuthorItem {
  name: string;
  birth_date: string;
  nationality: string;
  biography: string;
}
