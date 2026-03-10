import express from "express";
import { hasRole, protect } from "../middlewares/authMiddleware.js";
import { getSlots } from "../controllers/slotController.js";

const router = express.Router();

router.get("/", protect, hasRole(["superadmin", "receptionist"]), getSlots);

export default router;
