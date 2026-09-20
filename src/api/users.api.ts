import api from "./axios";

export type User = {
  id: string;
  email: string;
  phone: string;
  city: string;
  full_name: string | null;
  avatar_url?: string | null;
  role: "RENTER" | "OWNER" | "ADMIN";
  is_active: boolean;
  is_verified: boolean;
  avg_rating?: number;
  rating_count?: number;
  trust_score?: number;
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

  get: (id: string) =>
    api.get<User>(`/users/${id}`).then((res) => res.data),
};
