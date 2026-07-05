import api from "./axios";

export type TokenPair = {
  access_token: string;
  refresh_token: string;
  token_type: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  phone: string;
  city: string;
  full_name: string;
  role?: "RENTER" | "OWNER";
};

export type AuthenticatedUser = {
  id: string;
  email: string;
  phone: string;
  city: string;
  full_name: string | null;
  role: string;
  is_active: boolean;
  is_verified: boolean;
};

export const authApi = {
  login: (payload: LoginPayload) =>
    api.post<TokenPair>("/auth/login", payload).then((res) => res.data),

  register: (payload: RegisterPayload) =>
    api.post<{ message: string; verification_code: string }>("/auth/register", payload).then((res) => res.data),

  me: () => api.get<AuthenticatedUser>("/auth/me").then((res) => res.data),

  logout: () => api.post("/auth/logout"),
};
