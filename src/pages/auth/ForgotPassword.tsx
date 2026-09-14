import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { authApi } from "@/api/auth";
import { ROUTES } from "@/routes/routes";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authApi.forgotPassword({ email });
      setIsSent(true);
      toast.success("Password reset code sent to your email!");
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to send reset code");
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
            Forgot Password
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Enter your email to receive a reset code
          </p>
        </div>

        {!isSent ? (
          <form className="space-y-5" onSubmit={handleSubmit}>
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
            <Button type="submit" className="w-full h-11 text-base mt-2" isLoading={isLoading}>
              Send Reset Code
            </Button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Check your inbox! We've sent a recovery code to <strong>{email}</strong>.
            </p>
            <Link to={ROUTES.RESET_PASSWORD}>
              <Button className="w-full h-11 mt-4">Enter Reset Code</Button>
            </Link>
          </div>
        )}

        <p className="mt-8 text-center text-sm text-gray-500">
          Remember your password?{" "}
          <Link to={ROUTES.LOGIN} className="font-medium text-indigo-600 hover:text-indigo-500">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
