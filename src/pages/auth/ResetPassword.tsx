import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { authApi } from "@/api/auth";
import { ROUTES } from "@/routes/routes";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authApi.resetPassword({ email, code, new_password: newPassword });
      toast.success("Password reset successfully! You can now log in.");
      navigate(ROUTES.LOGIN);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Password reset failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl bg-white/80 backdrop-blur-xl p-8 shadow-xl border border-white/20"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Reset Password
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Enter your reset code and a new password
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleReset}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Reset Code</label>
            <Input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <Button type="submit" className="w-full h-11 text-base mt-2" isLoading={isLoading}>
            Set New Password
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Back to{" "}
          <Link to={ROUTES.LOGIN} className="font-medium text-indigo-600 hover:text-indigo-500">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
