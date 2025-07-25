"use client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

// ✅ Zod schema
const otpSchema = z.string().length(6, "OTP must be 6 digits");

// ✅ Mock API call
async function verifyOTP(otp: string): Promise<{ success: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate delay
  if (otp === "123456") {
    return { success: true };
  } else {
    throw new Error("Invalid OTP");
  }
}

export function InputOTPDemo() {
  const [otp, setOtp] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(60);

  // Countdown timer
  useEffect(() => {
    const timer =
      secondsLeft > 0 &&
      setInterval(() => setSecondsLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer as NodeJS.Timeout);
  }, [secondsLeft]);

  // Mutation for OTP verification
  const { mutate: submitOTP, isPending } = useMutation({
    mutationFn: verifyOTP,
    onSuccess: () => {
      toast.success("OTP verified successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Verification failed.");
    },
  });

  // Handle form submission
  const handleSubmit = () => {
    const parsed = otpSchema.safeParse(otp);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    submitOTP(otp);
  };

  const handleResend = () => {
    toast.success("OTP resent successfully");
    setSecondsLeft(60);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Verify Your OTP</h2>
        <p className="text-muted-foreground text-sm">
          Enter the 6-digit code sent to your email
        </p>
      </div>

      <InputOTP
        maxLength={6}
        value={otp}
        onChange={(value) => setOtp(value)}
        className="scale-110 transition-all"
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>

      <Button
        className="w-full max-w-[280px]"
        onClick={handleSubmit}
        disabled={otp.length !== 6 || isPending}
      >
        {isPending ? "Verifying..." : "Submit OTP"}
      </Button>

      <div className="text-sm text-muted-foreground">
        {secondsLeft > 0 ? (
          <span>Resend code in {secondsLeft}s</span>
        ) : (
          <button
            className="text-blue-600 hover:underline"
            onClick={handleResend}
          >
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
}
