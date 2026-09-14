import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { authApi } from "@/api/auth";
import { ROUTES } from "@/routes/routes";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const VerifyEmail = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authApi.verifyEmail({ email, code });
      toast.success("Email verified successfully! You can now log in.");
      navigate(ROUTES.LOGIN);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Verification failed");
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
            Verify Email
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Enter the code sent to your email
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleVerify}>
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
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Verification Code</label>
            <Input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              required
            />
          </div>
          <Button type="submit" className="w-full h-11 text-base mt-2" isLoading={isLoading}>
            Verify Email
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

export default VerifyEmail;
