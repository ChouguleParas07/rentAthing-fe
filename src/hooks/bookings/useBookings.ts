import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingsApi, type CreateBookingPayload, type BookingStatus } from "@/api/bookings.api";

export const useBookings = (params?: { skip?: number; limit?: number; item_id?: string; renter_id?: string; owner_id?: string }) => {
  return useQuery({
    queryKey: ["bookings", params],
    queryFn: () => bookingsApi.list(params),
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBookingPayload) => bookingsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookingStatus }) => bookingsApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};
