import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { Booking, BookingStatus } from "@/api/bookings.api";
import { escrowApi } from "@/api/escrow.api";
import { useUpdateBookingStatus } from "@/hooks/bookings/useBookings";
import { useItem } from "@/hooks/items/useItem";
import { Button } from "@/components/ui/Button";
import { CreateReviewModal } from "@/components/reviews/CreateReviewModal";
import { ROUTES } from "@/routes/routes";
import { MessageSquare, Calendar, CheckCircle, XCircle, Play, Shield, Star } from "lucide-react";

interface BookingCardProps {
  booking: Booking;
  isOwner: boolean;
}

export const BookingCard: React.FC<BookingCardProps> = ({ booking, isOwner }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateBookingStatus();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const { data: item } = useItem(booking.item_id);

  const { data: escrow } = useQuery({
    queryKey: ["escrow", booking.id],
    queryFn: () => escrowApi.getByBookingId(booking.id),
    enabled: booking.status !== "PENDING" && booking.status !== "REQUESTED" && booking.status !== "REJECTED" && booking.status !== "CANCELLED",
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
          toast.success(`Booking ${newStatus.toLowerCase()}!`);
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.detail || "Failed to update status");
        }
      }
    );
  };

  const handleOpenChat = () => {
    const targetUserId = isOwner ? booking.renter_id : (item?.owner_id || booking.renter_id);
    navigate(`${ROUTES.MESSAGES}?user_id=${targetUserId}`);
  };

  const getStatusBadgeClass = (status: BookingStatus) => {
    switch (status) {
      case "REQUESTED":
      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "APPROVED":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "ACTIVE":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "COMPLETED":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "REJECTED":
      case "CANCELLED":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="p-5 rounded-2xl border border-gray-200 bg-white flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex gap-4 items-start">
        {/* Item Thumbnail */}
        <div className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100">
          <img
            src={item?.images?.[0]?.url || `https://placehold.co/200x200/e2e8f0/1e293b?text=${encodeURIComponent(item?.title || "Item")}`}
            alt={item?.title || "Item"}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <div>
              <h4 className="font-bold text-gray-900 text-lg line-clamp-1">{item?.title || `Booking #${booking.id.substring(0, 8)}`}</h4>
              <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                {booking.start_date} → {booking.end_date}
              </p>
            </div>

            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusBadgeClass(booking.status)}`}>
                {booking.status}
              </span>
              {escrow && (
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${escrow.status === "HELD" ? "bg-amber-100 text-amber-800" :
                  escrow.status === "RELEASED" ? "bg-emerald-100 text-emerald-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                  <Shield className="w-3 h-3 inline mr-0.5" /> Escrow: {escrow.status}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 text-sm">
            <span className="font-bold text-gray-900 text-base">${booking.total_price} <span className="text-xs font-normal text-gray-500">total</span></span>
            <span className="text-xs text-gray-500">
              {isOwner ? `Renter: User ${booking.renter_id.substring(0, 8)}` : `Owner: User ${booking.owner_id?.substring(0, 8) || "Owner"}`}
            </span>
          </div>
        </div>
      </div>

      {/* Decision & Lifecycle Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-1 pt-3 border-t border-gray-100">
        <div className="flex flex-wrap gap-2">
          {/* OWNER DECISION: ACCEPT / REJECT incoming request */}
          {isOwner && (booking.status === "PENDING" || booking.status === "REQUESTED") && (
            <>
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                isLoading={isUpdating}
                onClick={() => handleStatusChange("APPROVED")}
              >
                <CheckCircle className="w-4 h-4 mr-1.5" /> Accept Request
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
                isLoading={isUpdating}
                onClick={() => handleStatusChange("REJECTED")}
              >
                <XCircle className="w-4 h-4 mr-1.5" /> Reject
              </Button>
            </>
          )}

          {/* OWNER ACTION: MARK ACTIVE / START RENTAL */}
          {isOwner && booking.status === "APPROVED" && (
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
              isLoading={isUpdating}
              onClick={() => handleStatusChange("ACTIVE")}
            >
              <Play className="w-4 h-4 mr-1.5" /> Start Rental (Active)
            </Button>
          )}

          {/* OWNER ACTION: MARK COMPLETED */}
          {isOwner && booking.status === "ACTIVE" && (
            <Button
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium"
              isLoading={isUpdating}
              onClick={() => handleStatusChange("COMPLETED")}
            >
              <CheckCircle className="w-4 h-4 mr-1.5" /> Mark Completed
            </Button>
          )}

          {/* RENTER ACTION: CANCEL */}
          {!isOwner && (booking.status === "PENDING" || booking.status === "REQUESTED" || booking.status === "APPROVED") && (
            <Button
              size="sm"
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
              isLoading={isUpdating}
              onClick={() => handleStatusChange("CANCELLED")}
            >
              Cancel Request
            </Button>
          )}

          {/* ESCROW ACTIONS FOR OWNER */}
          {isOwner && escrow?.status === "HELD" && booking.status === "COMPLETED" && (
            <>
              <Button
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                isLoading={settleMutation.isPending}
                onClick={() => settleMutation.mutate("RELEASE")}
              >
                Release Deposit
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-orange-600 border-orange-200 hover:bg-orange-50"
                isLoading={settleMutation.isPending}
                onClick={() => settleMutation.mutate("REFUND")}
              >
                Claim Deposit
              </Button>
            </>
          )}

          {/* RENTER ACTION: LEAVE REVIEW */}
          {!isOwner && booking.status === "COMPLETED" && (
            <Button
              size="sm"
              className="bg-amber-500 hover:bg-amber-600 text-white font-medium"
              onClick={() => setIsReviewModalOpen(true)}
            >
              <Star className="w-4 h-4 mr-1.5 fill-current" /> Leave Review
            </Button>
          )}
        </div>

        {/* CHAT ACTION BUTTON */}
        <Button
          size="sm"
          variant="outline"
          className="text-gray-700 border-gray-300 hover:bg-gray-50 ml-auto"
          onClick={handleOpenChat}
        >
          <MessageSquare className="w-4 h-4 mr-1.5 text-gray-500" />
          {isOwner ? "Chat Renter" : "Chat Owner"}
        </Button>
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
