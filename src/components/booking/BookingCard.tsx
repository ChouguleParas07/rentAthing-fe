import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { Booking, BookingStatus } from "@/api/bookings.api";

import { useUpdateBookingStatus } from "@/hooks/bookings/useBookings";
import { useItem } from "@/hooks/items/useItem";

import { CreateReviewModal } from "@/components/reviews/CreateReviewModal";
import { ROUTES } from "@/routes/routes";
import { MessageSquare, Calendar, MapPin, CheckCircle2, Star, Clock, XCircle, MoreVertical } from "lucide-react";

interface BookingCardProps {
  booking: Booking;
  isOwner: boolean;
}

export const BookingCard: React.FC<BookingCardProps> = ({ booking, isOwner }) => {

  const navigate = useNavigate();
  const { mutate: updateStatus } = useUpdateBookingStatus();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const { data: item } = useItem(booking.item_id);

  const handleStatusChange = (newStatus: BookingStatus) => {
    updateStatus(
      { id: booking.id, status: newStatus },
      {
        onSuccess: () => toast.success(`Booking ${newStatus.toLowerCase()}!`),
        onError: (err: any) => toast.error(err.response?.data?.detail || "Failed to update status")
      }
    );
  };

  const handleOpenChat = () => {
    const targetUserId = isOwner ? booking.renter_id : (item?.owner_id || booking.renter_id);
    navigate(`${ROUTES.MESSAGES}?user_id=${targetUserId}`);
  };

  // Status mapping for progress bar
  const statusLevels = {
    REQUESTED: 1, PENDING: 1,
    APPROVED: 2,
    ACTIVE: 3,
    COMPLETED: 4,
    CANCELLED: -1, REJECTED: -1
  };
  const level = statusLevels[booking.status] || 0;

  const isCancelled = level === -1;

  const renderProgressStep = (stepName: string, stepLevel: number) => {
    const isCompleted = level >= stepLevel && !isCancelled;

    const isFailed = isCancelled && stepLevel === 2; // For visual sake, show cancel at step 2

    let icon = <div className="w-4 h-4 rounded-full border-2 border-gray-300 bg-white z-10" />;
    let textClass = "text-gray-400";

    if (isCompleted) {
      icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 bg-white z-10 rounded-full" />;
      textClass = "text-emerald-600";
    } else if (isFailed && stepName === "Cancelled") {
      icon = <XCircle className="w-5 h-5 text-red-600 bg-white z-10 rounded-full fill-red-100" />;
      textClass = "text-red-600";
    }

    return (
      <div className="flex flex-col items-center gap-1 z-10 bg-white px-2">
        {icon}
        <span className={`text-[10px] font-bold ${textClass}`}>{stepName}</span>
      </div>
    );
  };

  return (
    <div className="p-5 rounded-3xl border border-gray-100 bg-white shadow-sm flex flex-col md:flex-row gap-6 mb-4 items-center">
      {/* Left section: Item details */}
      <div className="flex gap-4 w-full md:w-[35%] flex-shrink-0">
        <div className="w-24 h-24 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0">
          <img
            src={item?.images?.[0]?.url || `https://placehold.co/200x200/e2e8f0/1e293b?text=${encodeURIComponent(item?.title || "Item")}`}
            alt={item?.title || "Item"}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-extrabold text-[#1A2530] text-base line-clamp-1">{item?.title || `Booking #${booking.id.substring(0, 8)}`}</h4>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 capitalize">
              {item?.category?.name || "Category"}
            </span>
          </div>
          <p className="text-xs text-gray-500 flex items-center gap-1 mb-1">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            {booking.start_date} → {booking.end_date}
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            {item?.location_text || "Location"}
          </p>
          <span className="font-extrabold text-[#00A843] text-sm">₹{booking.total_price} <span className="text-[10px] font-normal text-gray-500">total</span></span>
        </div>
      </div>

      {/* Middle section: Progress & Alerts */}
      <div className="flex-1 w-full border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 flex flex-col justify-center">
        {/* Progress Tracker */}
        <div className="relative flex justify-between items-center mb-4 px-2">
          {/* Connecting line */}
          <div className="absolute top-2.5 left-6 right-6 h-0.5 bg-gray-200 -z-0">
            {level > 1 && !isCancelled && (
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: level === 2 ? '33%' : level === 3 ? '66%' : '100%' }}
              />
            )}
          </div>

          {renderProgressStep("Requested", 1)}
          {isCancelled ? renderProgressStep("Cancelled", 2) : renderProgressStep("Accepted", 2)}
          {renderProgressStep("Active", 3)}
          {renderProgressStep("Completed", 4)}
        </div>

        {/* Dynamic Alert Box */}
        {level === 4 && (
          <div className="bg-emerald-50 rounded-xl p-3 flex gap-3 items-start border border-emerald-100">
            <div className="mt-0.5"><Star className="w-4 h-4 fill-emerald-600 text-emerald-600" /></div>
            <div>
              <p className="text-xs font-bold text-emerald-800">Rental completed successfully!</p>
              <p className="text-xs text-emerald-600/80">We hope you had a great experience.</p>
            </div>
          </div>
        )}

        {(level === 1 || level === 2) && !isCancelled && (
          <div className="bg-blue-50 rounded-xl p-3 flex gap-3 items-start border border-blue-100">
            <div className="mt-0.5"><Clock className="w-4 h-4 text-blue-600" /></div>
            <div>
              <p className="text-xs font-bold text-blue-800">Your booking request is {level === 1 ? "under review" : "approved"}.</p>
              <p className="text-xs text-blue-600/80">The {isOwner ? "renter" : "owner"} will respond soon.</p>
            </div>
          </div>
        )}

        {isCancelled && (
          <div className="bg-red-50 rounded-xl p-3 flex gap-3 items-start border border-red-100">
            <div className="mt-0.5"><XCircle className="w-4 h-4 text-red-600" /></div>
            <div>
              <p className="text-xs font-bold text-red-800">This booking has been cancelled.</p>
              <p className="text-xs text-red-600/80">If you have any questions, you can contact the {isOwner ? "renter" : "owner"}.</p>
            </div>
          </div>
        )}
      </div>

      {/* Right section: Actions */}
      <div className="flex flex-col items-end gap-3 w-full md:w-auto md:min-w-[140px] pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${level === 4 ? 'bg-purple-100 text-purple-700' :
          isCancelled ? 'bg-red-50 text-red-700' :
            'bg-blue-50 text-blue-700'
          }`}>
          {booking.status}
        </span>

        <div className="flex flex-col gap-2 w-full mt-auto">
          {level === 4 && (
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full border border-emerald-200 text-emerald-700 text-xs font-bold hover:bg-emerald-50 transition-colors"
            >
              <Star className="w-3.5 h-3.5" /> Leave Review
            </button>
          )}

          {level < 3 && !isCancelled && !isOwner && (
            <button
              onClick={() => handleStatusChange("CANCELLED")}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full border border-red-200 text-red-600 text-xs font-bold hover:bg-red-50 transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" /> Cancel Booking
            </button>
          )}

          <div className="flex gap-2 w-full">
            <button
              onClick={handleOpenChat}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Chat {isOwner ? "Renter" : "Owner"}
            </button>
            <button className="p-1.5 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <CreateReviewModal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} itemId={booking.item_id} bookingId={booking.id} />
    </div>
  );
};
