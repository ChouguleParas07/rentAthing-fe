import { useQuery } from "@tanstack/react-query";
import { itemsApi } from "@/api/items.api";

export const useItems = (params?: { skip?: number; limit?: number; category_id?: string; owner_id?: string }) => {
  return useQuery({
    queryKey: ["items", params],
    queryFn: () => itemsApi.list(params),
  });
};
