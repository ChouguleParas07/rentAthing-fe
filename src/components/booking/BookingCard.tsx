import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Booking, BookingStatus } from "@/api/bookings.api";
import { escrowApi } from "@/api/escrow.api";
import { useUpdateBookingStatus } from "@/hooks/bookings/useBookings";
import { Button } from "@/components/ui/Button";
import { CreateReviewModal } from "@/components/reviews/CreateReviewModal";
import { useState } from "react";

interface BookingCardProps {
  booking: Booking;
  isOwner: boolean;
}

export const BookingCard: React.FC<BookingCardProps> = ({ booking, isOwner }) => {
  const queryClient = useQueryClient();
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateBookingStatus();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const { data: escrow } = useQuery({
    queryKey: ["escrow", booking.id],
    queryFn: () => escrowApi.getByBookingId(booking.id),
    enabled: booking.status !== "PENDING" && booking.status !== "REJECTED" && booking.status !== "CANCELLED",
  });

  const settleMutation = useMutation({
    mutationFn: (action: "RELEASE" | "REFUND") => escrowApi.settle(escrow!.id, action),
    onSuccess: () => {
      toast.success("Escrow settled successfully");
      queryClient.invalidateQueries({ queryKey: ["escrow", booking.id] });
    },
    onError: () => toast.error("Failed to settle escrow"),
  });

  const handleStatusChange = (newStatus: BookingStatus) => {
    updateStatus(
      { id: booking.id, status: newStatus },
      {
        onSuccess: () => {
          toast.success(`Booking ${newStatus.toLowerCase()}`);
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.detail || "Failed to update status");
        }
      }
    );
  };

  return (
    <div className="p-5 rounded-xl border border-gray-200 bg-white flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-gray-900 text-lg">Booking #{booking.id.substring(0, 8)}</p>
          <p className="text-sm text-gray-500 mt-1">{booking.start_date} to {booking.end_date}</p>
          <p className="text-sm font-medium text-gray-700 mt-2">Total: ${booking.total_price}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-bold uppercase tracking-wide">
            {booking.status}
          </div>
          {escrow && (
            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${escrow.status === "HELD" ? "bg-amber-50 text-amber-700" :
              escrow.status === "RELEASED" ? "bg-green-50 text-green-700" :
                "bg-gray-100 text-gray-700"
              }`}>
              Escrow: {escrow.status}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-2 pt-4 border-t border-gray-100">
        {/* Owner actions for PENDING */}
        {isOwner && booking.status === "PENDING" && (
          <>
            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" isLoading={isUpdating} onClick={() => handleStatusChange("APPROVED")}>
              Accept
            </Button>
            <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" isLoading={isUpdating} onClick={() => handleStatusChange("REJECTED")}>
              Reject
            </Button>
          </>
        )}

        {/* Both actions for active/approved bookings to cancel (if not yet started in real life, but we just allow CANCELLED for simplicity) */}
        {!isOwner && (booking.status === "PENDING" || booking.status === "APPROVED") && (
          <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" isLoading={isUpdating} onClick={() => handleStatusChange("CANCELLED")}>
            Cancel Booking
          </Button>
        )}

        {/* Owner actions to complete a booking */}
        {isOwner && booking.status === "ACTIVE" && (
          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" isLoading={isUpdating} onClick={() => handleStatusChange("COMPLETED")}>
            Mark Completed
          </Button>
        )}

        {/* Escrow actions for Owner */}
        {isOwner && escrow?.status === "HELD" && booking.status === "COMPLETED" && (
          <>
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white" isLoading={settleMutation.isPending} onClick={() => settleMutation.mutate("RELEASE")}>
              Release Deposit (No Damage)
            </Button>
            <Button size="sm" variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50" isLoading={settleMutation.isPending} onClick={() => settleMutation.mutate("REFUND")}>
              Claim Deposit (Damage)
            </Button>
          </>
        )}

        {/* Renter action: Leave Review */}
        {!isOwner && booking.status === "COMPLETED" && (
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => setIsReviewModalOpen(true)}>
            Leave Review
          </Button>
        )}
      </div>

      <CreateReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        itemId={booking.item_id}
        bookingId={booking.id}
      />
    </div>
  );
};
