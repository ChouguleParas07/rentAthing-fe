import api from "./axios";

export type Category = {
  id: string;
  name: string;
  description: string;
};

export type Item = {
  id: string;
  owner_id: string;
  category: Category;
  category_id: string;
  title: string;
  description: string;
  daily_price: number;
  security_deposit: number;
  location_lat: number;
  location_lng: number;
  location_text: string | null;
  available_from: string;
  available_until: string | null;
  images: { url: string }[] | null;
  avg_rating: number;
  rating_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ItemListResponse = {
  items: Item[];
  total: number;
};

export type CreateItemPayload = {
  category_id?: string | null;
  title: string;
  description?: string | null;
  daily_price: number;
  security_deposit: number;
  location_lat: number;
  location_lng: number;
  location_text?: string | null;
  available_from?: string | null;
  available_until?: string | null;
  images?: { url: string }[] | null;
};

export const itemsApi = {
  list: (params?: { search?: string; skip?: number; limit?: number; category_id?: string; owner_id?: string }) =>
    api.get<ItemListResponse>("/items", { params }).then((res) => res.data),

  get: (id: string) => api.get<Item>(`/items/${id}`).then((res) => res.data),

  create: (payload: CreateItemPayload) =>
    api.post<Item>("/items", payload).then((res) => res.data),

  update: (id: string, payload: Partial<CreateItemPayload>) =>
    api.patch<Item>(`/items/${id}`, payload).then((res) => res.data),

  delete: (id: string) => api.delete(`/items/${id}`).then((res) => res.data),

  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post<{ url: string }>("/items/images", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then((res) => res.data);
  },
};
