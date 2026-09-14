import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewsApi } from "../../api/reviews.api";
import type { CreateReviewPayload } from "../../api/reviews.api";

export const useReviews = (itemId: string) => {
  return useQuery({
    queryKey: ["reviews", itemId],
    queryFn: () => reviewsApi.listByItem(itemId),
    enabled: !!itemId,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => reviewsApi.create(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", variables.item_id] });
    },
  });
};
