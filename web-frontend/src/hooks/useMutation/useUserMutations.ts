"use client";

import {
  emailVerification,
  loginUser,
  registerUser,
  resendEmailVerification,
} from "@/lib/Fetchs";

import { useMutation } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const useSignUpMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: RegisterPayloadType) => registerUser(payload),
    onSuccess: (data) => {
      // console.log("data:", data)
      toast.success("Please verify your email!");
      router.push(`/otp?email=${encodeURIComponent(data?.email)}`);
    },
    onError: (e) => {
      if (isAxiosError(e)) {
        toast.error(
          e?.response?.data?.message ||
            e?.message ||
            "Something went wrong while trying to register!"
        );
      }
    },
  });
};

//Resend Email Verification COde
export const useResendEmailVarificationMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: ResendEmailVarificationPayloadType) =>
      resendEmailVerification(payload),
    onSuccess: (data) => {
      toast.success("Resend email verification Code, Please check your email!");
      router.push(`/otp?email=${encodeURIComponent(data?.email)}`);
    },
    onError: (e) => {
      if (isAxiosError(e)) {
        toast.error(
          e?.response?.data?.message ||
            e?.message ||
            "Something went wrong while trying to resend email verifaction code!"
        );
      }
    },
  });
};
export const useEmailVerificationMutation = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: (payload: EmailVarificationPayloadType) =>
      emailVerification(payload),
    onSuccess: () => {
      toast.success("Verifed your email successfully!");
      router.push("/login");
    },
    onError: (e) => {
      if (isAxiosError(e)) {
        toast.error(
          e?.response?.data?.message ||
            e?.message ||
            "Something went wrong while trying to verified email!"
        );
      }
    },
  });
};
// login

export const useLoginMutation = () => {
  const route = useRouter();
  return useMutation({
    mutationFn: (payload: LoginPayloadType) => loginUser(payload),
    onSuccess: (data: LoginResponseDataType) => {
      toast.success("Logged in successfullyd");
      if (data?.user?.role.toUpperCase() === "USER") {
        route.push("/user");
      } else if (data.user.role.toUpperCase() === "ADMIN") {
        route.push("/admin");
      }
    },
    onError: (e) => {
      if (isAxiosError(e)) {
        toast.error(
          e.response?.data?.message ||
            e.message ||
            e.response?.data ||
            "Something went wrong while trying to login"
        );
      }
    },
  });
};
