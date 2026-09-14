import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Star } from "lucide-react";
import { reviewsApi } from "@/api/reviews.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CreateReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  bookingId: string;
}

export const CreateReviewModal: React.FC<CreateReviewModalProps> = ({ isOpen, onClose, itemId, bookingId }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => reviewsApi.create({ item_id: itemId, booking_id: bookingId, rating, comment }),
    onSuccess: () => {
      toast.success("Review submitted!");
      queryClient.invalidateQueries({ queryKey: ["reviews", itemId] });
      onClose();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || "Failed to submit review");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    mutation.mutate();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Leave a Review">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-gray-600 font-medium">How was your experience?</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  className={`w-10 h-10 transition-colors ${(hoverRating || rating) >= star ? "fill-amber-400 text-amber-400" : "text-gray-300"
                    }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Write your review</label>
          <textarea
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full h-32 rounded-xl border border-gray-300 p-3 outline-none focus:border-green-600 resize-none"
            placeholder="Tell us what you liked or what could be improved..."
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12"
          isLoading={mutation.isPending}
        >
          Submit Review
        </Button>
      </form>
    </Modal>
  );
};
