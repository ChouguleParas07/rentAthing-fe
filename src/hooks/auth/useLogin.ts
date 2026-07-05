import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { authApi, type LoginPayload } from "@/api/auth";
import { ROUTES } from "@/routes/routes";
import { setCredentials } from "@/store/authSlice";
import { useAppDispatch } from "@/store/hooks";

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      dispatch(setCredentials({ user: null, token: data.access_token }));
      toast.success("Logged in successfully");
      navigate(ROUTES.DASHBOARD);
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || "Invalid email or password";
      toast.error(message);
    },
  });
};
