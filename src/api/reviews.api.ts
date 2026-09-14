import api from "./axios";

export type Review = {
  id: string;
  item_id: string;
  reviewer_id: string;
  rating: number;
  comment: string;
  created_at: string;
};

export type ReviewListResponse = {
  items: Review[];
  total: number;
};

export type CreateReviewPayload = {
  item_id: string;
  booking_id: string;
  rating: number;
  comment: string;
};

export const reviewsApi = {
  listByItem: (itemId: string, skip = 0, limit = 20) =>
    api.get<ReviewListResponse>(`/reviews/items/${itemId}`, { params: { skip, limit } }).then((res) => res.data),

  listByUser: (userId: string, skip = 0, limit = 20) =>
    api.get<ReviewListResponse>(`/reviews/users/${userId}`, { params: { skip, limit } }).then((res) => res.data),

  create: (payload: CreateReviewPayload) =>
    api.post<Review>("/reviews", payload).then((res) => res.data),
};
