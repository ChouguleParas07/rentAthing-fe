import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/api/users.api";

export const useUser = (userId: string | null | undefined) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => usersApi.get(userId!),
    enabled: !!userId,
  });
};
