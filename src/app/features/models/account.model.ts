export type Role = 'admin' | 'librarian' | 'stock-keeper';
export interface UserDetail {
  _id: string;
  username: string;
  role: Role;
  image_url: string | null;
  status: boolean;
  start_date: string;
  contact: { phone_number: string; email: string };
  address: {
    village: string | null;
    commune: string | null;
    district: string | null;
    city: string | null;
  };
}