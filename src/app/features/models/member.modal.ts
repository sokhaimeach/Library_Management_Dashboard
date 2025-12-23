export interface MemberI {
  _id: string;
  name: string;
  member_type: 'regular' | 'vip' | 'blacklist';
  join_date: { $date: string };
  contact: {
    phone_number: string;
    email: string;
  };
}

export interface MemberItem {
    name: string;
    contact: {
      phone_number: string;
      email: string;
    };
}