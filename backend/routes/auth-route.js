import express from "express";
import {
  loginUser,
  registerUser,
  resendVerificationEmail,
  verifyEmail,
} from "../controllers/auth-controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification-code", resendVerificationEmail);
router.post("/login", loginUser);

export default router;
