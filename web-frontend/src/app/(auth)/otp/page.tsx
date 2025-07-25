import Layout from "@/components/layouts/Layout";
import { InputOTPDemo } from "@/components/auth/InputOtp";
import React from "react";

function Otp() {
  return (
    <>
      <Layout>
        <div>
          <InputOTPDemo />
        </div>
      </Layout>
    </>
  );
}

export default Otp;
