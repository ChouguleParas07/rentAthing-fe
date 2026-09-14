import api from "./axios";

export type EscrowStatus = "PENDING" | "HELD" | "RELEASED" | "REFUNDED" | "DISPUTED";

export type Escrow = {
  id: string;
  booking_id: string;
  amount: number;
  status: EscrowStatus;
  created_at: string;
  updated_at: string;
};

export const escrowApi = {
  getByBookingId: (bookingId: string) =>
    api.get<Escrow>(`/escrow/bookings/${bookingId}`).then((res) => res.data),

  settle: (id: string, action: "RELEASE" | "REFUND") =>
    api.post<Escrow>(`/escrow/${id}/settle`, { action }).then((res) => res.data),
};
