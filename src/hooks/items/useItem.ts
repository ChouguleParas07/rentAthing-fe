import { useQuery } from "@tanstack/react-query";
import { itemsApi } from "@/api/items.api";

export const useItem = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ["items", id],
    queryFn: () => itemsApi.get(id),
    enabled: enabled && !!id,
  });
};
