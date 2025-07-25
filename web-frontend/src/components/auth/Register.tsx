"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSignup } from "@/hooks/useMutation/useUserMutations";
import Link from "next/link";
import WidthWrapper from "../WidthWrapper";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const signup = useSignup();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className=" flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-[400px] space-y-4 h-full  rounded  bg-white primary "
      >
        <h2 className="text-2xl font-semibold text-center">Sign Up</h2>
        <p className="text-base font-medium text-gray-900 flex justify-center ">
          Your new beginning starts with Punarjanma.
        </p>
        <div className="space-y-2 rounded-full">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            onChange={handleChange }
            value={formData.name}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            onChange={handleChange}
            value={formData.email}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            onChange={handleChange}
            value={formData.password}
          />
        </div>

        <Button type="submit" className="w-full" disabled={signup.isPending}>
          {signup.isPending ? "Signing Up..." : "Sign Up"}
        </Button>
        <div className="inline-flex gap-2">
          <p>Already have account?</p>
          <Link className="text-blue-600 underline" href="/login">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}
