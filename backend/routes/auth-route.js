import express from "express";
import {
  loginUser,
  registerUser,
  resendVerificationEmail,
  verifyEmail,
  getMe,
  logoutUser,
  refreshAccessTokenController, 
} from "../controllers/auth-controller.js";
import { authenticateUser } from "../middleware/auth-middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification-code", resendVerificationEmail);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", authenticateUser, getMe);
router.post("/refresh-token", refreshAccessTokenController);

export default router;
