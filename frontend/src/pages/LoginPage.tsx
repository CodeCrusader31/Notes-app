import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";

const authSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type AuthFormValues = z.infer<typeof authSchema>;

export function LoginPage() {
  const { login, isLoggingIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = async (values: AuthFormValues) => {
    try {
      await login(values);
      toast.success("Welcome back");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    }
  };

  return (
    <motion.div
      className="w-full max-w-md rounded-2xl border border-ink-100 bg-white p-6 shadow-soft"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <p className="text-sm font-medium text-ink-500">Sign in</p>
      <h2 className="mt-2 text-2xl font-semibold text-ink-900">Continue to your notes</h2>
      <form className="mt-7 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <Button disabled={isLoggingIn} icon={<LogIn size={18} />} type="submit">
          {isLoggingIn ? "Signing in..." : "Login"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-500">
        No account?{" "}
        <Link className="font-medium text-ink-900 hover:underline" to="/register">
          Create one
        </Link>
      </p>
    </motion.div>
  );
}
