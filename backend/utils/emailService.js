import nodemailer from "nodemailer";
import { getVerificationEmailTemplate } from "../templates/verificationCodeTemplate.js";

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendVerificationEmail = async (email, verificationCode, name) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: {
        name: "7 Rings Nepal",
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject: "Email Verification Code",
      html: getVerificationEmailTemplate(name,verificationCode),
    };
    const result = await transporter.sendMail(mailOptions);
    console.log("Verification email sent:", result.messageId);
    // return { success: false, messageId: result.messageId };
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending verification email!");
    return { success: false, error: error.message };
  }
};

//send password reset email
export const sendPasswordResetEmail = async (email, resetToken, name) => {
  try {
    const transporter = createTransporter();
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: {
        name: "Your App Name",
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset</h2>
          <p>Hello ${name},</p>
          <p>You requested a password reset. Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #007bff;">${resetUrl}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this reset, please ignore this email.</p>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return { success: false, error: error.message };
  }
};