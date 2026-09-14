import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion";

import { useRegister } from "@/hooks/auth/useRegister";
import { ROUTES } from "@/routes/routes";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const registerSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Enter a valid email"),
  phone: z.string().min(10, "Enter a valid phone number").max(20, "Phone number is too long"),
  city: z.string().min(2, "City is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["RENTER", "OWNER"]),
});

type RegisterForm = z.infer<typeof registerSchema>;

const Register = () => {
  const registerUser = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "RENTER" },
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-10 bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md rounded-3xl bg-white/80 backdrop-blur-xl p-8 shadow-2xl shadow-green-100/50 border border-white/40"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600">
            Create account
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Join Stashly to rent or list items
          </p>
        </div>

        <form
          className="space-y-4"
          onSubmit={handleSubmit((data) => registerUser.mutate(data))}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="full_name">
              Full name
            </label>
            <Input
              id="full_name"
              placeholder="John Doe"
              error={errors.full_name?.message}
              {...register("full_name")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="email">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              error={errors.email?.message}
              {...register("email")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="phone">
                Phone
              </label>
              <Input
                id="phone"
                placeholder="+1 234 567 890"
                error={errors.phone?.message}
                {...register("phone")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="city">
                City
              </label>
              <Input
                id="city"
                placeholder="New York"
                error={errors.city?.message}
                {...register("city")}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="role">
              I want to
            </label>
            <select
              id="role"
              className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 transition-shadow outline-none"
              {...register("role")}
            >
              <option value="RENTER">Rent items</option>
              <option value="OWNER">List items for rent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="password">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-11 text-base mt-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-600/20 border-0"
            isLoading={registerUser.isPending}
          >
            Create account
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to={ROUTES.LOGIN} className="font-medium text-green-600 hover:text-green-500 transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;

