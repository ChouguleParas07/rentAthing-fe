import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { authApi, type RegisterPayload } from "@/api/auth";
import { ROUTES } from "@/routes/routes";

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: () => {
      toast.success("Account created. Please verify your email.");
      navigate(ROUTES.VERIFY_EMAIL);
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || "Registration failed. Please check your details.";
      toast.error(message);
    },
  });
};
