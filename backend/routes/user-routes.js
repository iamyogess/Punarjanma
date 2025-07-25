import express from "express";
import {
  changeUserPassword,
  deleteUser,
  getAllUsers,
  getCurrentUser,
} from "../controllers/user-controller.js";

const router = express.Router();

router.get("/me", getCurrentUser);
router.put("/change-password", changeUserPassword);
router.delete("/delete/:userId", deleteUser);

router.get("/", getAllUsers);

export default router;
