"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useLoginMutation } from "@/hooks/useMutation/useUserMutations";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { mutate, isPending } = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    mutate(data);
  };

  return (
    <div className=" flex justify-center ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" space-y-4 p-6  bg-white w-[400px]"
      >
        <h2 className="text-2xl font-semibold text-center">Welcome, Back</h2>
        <span className="flex justify-center text-sm ">
          Enter your valid credentials to continue.
        </span>
        <div className="space-y-1 ">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register("password")} />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-primary"
          disabled={isPending}
        >
          {isPending ? "Logging in..." : "Login"}
        </Button>
        <div className="inline-flex gap-2">
          <p>Don't Have an account?</p>
          <Link className="text-blue-600 underline" href="/register">
            signup
          </Link>
        </div>
      </form>
    </div>
  );
}
