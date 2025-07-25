import Layout from "@/components/layouts/Layout";
import { InputOTPDemo } from "@/components/otp/InputOtp";
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
