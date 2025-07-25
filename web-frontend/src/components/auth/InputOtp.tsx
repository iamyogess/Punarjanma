"use client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { z } from "zod";
import { toast } from "react-hot-toast";
import {
  useEmailVerificationMutation,
  useResendEmailVarificationMutation,
} from "@/hooks/useMutation/useUserMutations";
import { useSearchParams } from "next/navigation";

// Zod schemas
const otpSchema = z.string().length(6, "OTP must be 6 digits");
const emailSchema = z.string().email("Invalid email address");

export function InputOTPDemo() {
  const [otp, setOtp] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [email, setEmail] = useState("");
  const searchParams = useSearchParams();

  // Load email from URL query param
  useEffect(() => {
    const encodedEmail = searchParams.get("email");
    if (encodedEmail) {
      setEmail(decodeURIComponent(encodedEmail));
    }
  }, [searchParams]);

  // Countdown timer
  useEffect(() => {
    if (email && secondsLeft > 0) {
      const timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [secondsLeft, email]);

  // Mutations
  const { mutate, isPending } = useEmailVerificationMutation();
  const { mutate: resendEmailMutate, isPending: isResendPending } =
    useResendEmailVarificationMutation();

  const handleSubmit = () => {
    const emailCheck = emailSchema.safeParse(email);
    if (!emailCheck.success) {
      toast.error(emailCheck.error.issues[0].message);
      return;
    }

    const otpCheck = otpSchema.safeParse(otp);
    if (!otpCheck.success) {
      toast.error(otpCheck.error.issues[0].message);
      return;
    }

    mutate({
      email,
      verificationCode: otp,
    });
  };

  const handleResend = () => {
    const emailCheck = emailSchema.safeParse(email);
    if (!emailCheck.success) {
      toast.error(emailCheck.error.issues[0].message);
      return;
    }

    resendEmailMutate({ email });
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

      {/* Email input field if not available from query param */}
      {!email && (
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full max-w-[280px]"
        />
      )}

      {/* OTP Input */}
      {email && (
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
      )}

      {/* Submit Button */}
      <Button
        className="w-full max-w-[280px]"
        onClick={handleSubmit}
        disabled={otp.length !== 6 || isPending || !email}
      >
        {!email
          ? "Enter Email First"
          : isPending
          ? "Verifying..."
          : "Submit OTP"}
      </Button>

      {/* Resend Section */}
      <div className="text-sm text-muted-foreground">
        {email ? (
          secondsLeft > 0 ? (
            <span>Resend code in {secondsLeft}s</span>
          ) : (
            <button
              className="text-blue-600 hover:underline"
              onClick={handleResend}
              disabled={isResendPending}
            >
              {isResendPending ? "Resending OTP..." : "Resend OTP"}
            </button>
          )
        ) : (
          <span>Enter your email to receive a code</span>
        )}
      </div>
    </div>
  );
}
