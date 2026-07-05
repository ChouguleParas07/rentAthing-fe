import api from "./axios";

export type BookingStatus = "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE" | "COMPLETED" | "CANCELLED";

export type Booking = {
  id: string;
  item_id: string;
  renter_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
};

export type BookingListResponse = {
  items: Booking[];
  total: number;
};

export type CreateBookingPayload = {
  item_id: string;
  start_date: string;
  end_date: string;
};

export const bookingsApi = {
  list: (params?: { skip?: number; limit?: number; item_id?: string; renter_id?: string }) =>
    api.get<BookingListResponse>("/bookings", { params }).then((res) => res.data),

  get: (id: string) => api.get<Booking>(`/bookings/${id}`).then((res) => res.data),

  create: (payload: CreateBookingPayload) =>
    api.post<Booking>("/bookings", payload).then((res) => res.data),

  updateStatus: (id: string, status: BookingStatus) =>
    api.patch<Booking>(`/bookings/${id}/status`, { status }).then((res) => res.data),
};
