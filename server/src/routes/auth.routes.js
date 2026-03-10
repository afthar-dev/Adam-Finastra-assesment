import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  checkAuth,
  loginUser,
  logoutUser,
} from "../controllers/authController.js";

const router = express.Router();

router.get("/check-auth", protect, checkAuth);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

export default router;
