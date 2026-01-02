export type BorrowStatus = 'overdue' | 'returned' | 'lost' | 'late' | 'damaged';
export type MemberType = 'regular' | 'vip' | 'blacklist';

export interface BorrowI {
  _id: string;
  return_date: string | null;
  status: BorrowStatus;
  borrow_date: string;
  due_date: string;
  member_name: string;
  book_title: string;
}

export interface ReturnI {
  status: string;
  damage_type?: string;
  damage_fee?: number;
}

export interface BorrowDatail {
  _id: string;
  status: BorrowStatus;
  member: {
    _id: string;
    name: string;
    contact: { phone_number: string; email: string };
    member_type: MemberType;
    join_date: string;
  };
  book: {
    title: string;
    cover_url: string;
    price: { $numberDecimal: string | number };
    total_copies: number;
    category: string;
    author_name: string;
  };
  user: {
    username: string;
    contact: { phone_number: string; email: string };
  };
}
