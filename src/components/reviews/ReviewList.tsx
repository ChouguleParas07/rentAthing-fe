import React from "react";
import { Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { reviewsApi } from "@/api/reviews.api";

interface ReviewListProps {
  targetId: string;
}

const ReviewList: React.FC<ReviewListProps> = ({ targetId }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["reviews", targetId],
    queryFn: () => reviewsApi.listByItem(targetId),
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Reviews</h3>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-24 bg-gray-100 rounded-xl"></div>
          <div className="h-24 bg-gray-100 rounded-xl"></div>
        </div>
      ) : data?.items?.length ? (
        <div className="space-y-4">
          {data.items.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-gray-200"}`} />
                  ))}
                </div>
                <span className="text-sm text-gray-500 font-medium">User {(review.author_id || review.reviewer_id || "").substring(0, 8)}</span>
                <span className="text-sm text-gray-400 mx-1">•</span>
                <span className="text-sm text-gray-400">{review.created_at ? new Date(review.created_at).toLocaleDateString() : ""}</span>
              </div>
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 text-center">
          <Star className="mx-auto text-gray-400 mb-2" size={32} />
          <p className="text-gray-600 dark:text-gray-400">No reviews yet for this item.</p>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
