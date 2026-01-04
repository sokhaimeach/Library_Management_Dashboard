export type PenaltyStatus = 'pending' | 'paid' | 'replaced' | 'returned';
export type PenaltyType = "lost" | "late" | "damage";

export interface PenaltyListItem {
  _id: string;
  penalty_type: PenaltyType;
  amount: number;
  status: PenaltyStatus;
  note: string;
  received_at: string | null;
  created_at: string;
  member_name: string;
  phone_number: string;
}

export interface PenaltyItem {
  borrow_id: string;
  penalty_type: PenaltyType;
  amount: number;
  note: string;
}

export interface PenaltyDetail {
  _id: string;
  penalty_type: PenaltyType;
  amount: number;
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
    price: number;
    total_copies: number;
    category: string;
    author_name: string;
  };
}
