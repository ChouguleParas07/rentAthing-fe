import { useQuery } from "@tanstack/react-query";

import { authApi } from "@/api/auth";
import { setUser } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export const useProfile = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const user = await authApi.me();
      dispatch(setUser(user));
      return user;
    },
    enabled: isAuthenticated,
  });
};
