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
  avatar_url?: string | null;
  role: string;
  is_active: boolean;
  is_verified: boolean;
  average_rating?: number | null;
};

export const authApi = {
  login: (payload: LoginPayload) =>
    api.post<TokenPair>("/auth/login", payload).then((res) => res.data),

  register: (payload: RegisterPayload) =>
    api.post<{ message: string; verification_code: string }>("/auth/register", payload).then((res) => res.data),

  me: () => api.get<AuthenticatedUser>("/auth/me").then((res) => res.data),

  updateProfile: (payload: { full_name?: string; phone?: string; city?: string; avatar_url?: string }) =>
    api.patch<AuthenticatedUser>("/auth/me", payload).then((res) => res.data),

  logout: () => api.post("/auth/logout"),

  verifyEmail: (payload: { email: string; code: string }) =>
    api.post("/auth/verify-email", payload).then((res) => res.data),

  forgotPassword: (payload: { email: string }) =>
    api.post("/auth/forgot-password", payload).then((res) => res.data),

  resetPassword: (payload: { email: string; code: string; new_password: string }) =>
    api.post("/auth/reset-password", payload).then((res) => res.data),
};
