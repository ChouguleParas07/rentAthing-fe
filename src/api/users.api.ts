import api from "./axios";

export type User = {
  id: string;
  email: string;
  phone: string;
  city: string;
  full_name: string | null;
  role: "RENTER" | "OWNER" | "ADMIN";
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  last_login_at: string | null;
};

export type UserListResponse = {
  items: User[];
  total: number;
};

export const usersApi = {
  list: (params?: { skip?: number; limit?: number }) =>
    api.get<UserListResponse>("/users", { params }).then((res) => res.data),
};
