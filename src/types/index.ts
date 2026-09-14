export type UserRole = "RENTER" | "OWNER" | "ADMIN";

export type User = {
  id: string;
  email: string;
  phone: string;
  city: string;
  full_name: string | null;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};
