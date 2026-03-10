import express from "express";
import { hasRole, protect } from "../middlewares/authMiddleware.js";
import { getDoctors } from "../controllers/doctorController.js";

const router = express.Router();

router.get("/", protect, hasRole(["superadmin", "receptionist"]), getDoctors);

export default router;
