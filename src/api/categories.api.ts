import api from "./axios";

export type Category = {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export const categoriesApi = {
  list: () => api.get<Category[]>("/categories").then((res) => res.data),
};
