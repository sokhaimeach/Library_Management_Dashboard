export type PenaltyStatus = 'pending' | 'paid' | 'replaced' | 'returned';

export interface PenaltyListItem {
  _id: string;
  penalty_type: string;
  amount: {$numberDecimal: string};
  status: PenaltyStatus;
  note: string;
  received_at: string | null;
  created_at: string;
  member_name: string;
  phone_number: string;
}

export interface PenaltyDetail {
  _id: string;
  penalty_type: string;
  amount: {$numberDecimal: string};
  status: PenaltyStatus;
  note: string;
  received_at: string | null;
  created_at: string;
  member: {
    _id: string;
    name: string;
    contact: { phone_number: string; email: string };
    member_type: string;
    join_date: string;
  };
  borrow_info: {
    return_date: string | null;
    status: string;
    borrow_date: string;
    due_date: string;
  };
  book: {
    title: string;
    cover_url: string;
    price: {$numberDecimal: string};
    total_copies: number;
    category: string;
    author_name: string;
  };
}