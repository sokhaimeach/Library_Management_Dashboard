import { Role } from './account.model';

export interface UserI {
  _id?: string;
  username: string;
  role: Role;
  image_url: string | null;
  status?: boolean;
  password?: string;
  contact: {
    phone_number: string;
    email?: string | null;
  };
  start_date?: Date | string;
  address: {
    village: string | null;
    commune: string | null;
    district: string | null;
    city: string | null;
  };
}
