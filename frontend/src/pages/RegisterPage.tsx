import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";

const registerSchema = z
  .object({
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const { register: registerUser, isRegistering } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async ({ email, password }: RegisterFormValues) => {
    try {
      await registerUser({ email, password });
      toast.success("Account created");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed");
    }
  };

  return (
    <motion.div
      className="w-full max-w-md rounded-2xl border border-ink-100 bg-white p-6 shadow-soft"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <p className="text-sm font-medium text-ink-500">Register</p>
      <h2 className="mt-2 text-2xl font-semibold text-ink-900">Create your workspace</h2>
      <form className="mt-7 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
        <Input id="email" label="Email" type="email" error={errors.email?.message} {...register("email")} />
        <Input
          id="password"
          label="Password"
          type="password"
          error={errors.password?.message}
          {...register("password")}
        />
        <Input
          id="confirmPassword"
          label="Confirm password"
          type="password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <Button disabled={isRegistering} icon={<UserPlus size={18} />} type="submit">
          {isRegistering ? "Creating..." : "Create account"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-500">
        Already registered?{" "}
        <Link className="font-medium text-ink-900 hover:underline" to="/login">
          Login
        </Link>
      </p>
    </motion.div>
  );
}
