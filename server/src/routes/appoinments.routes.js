import express from "express";
import {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
  markArrived,
} from "../controllers/appoinmentController.js";

import { protect, hasRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  hasRole(["receptionist", "superadmin"]),
  createAppointment,
);
router.get("/", protect, getAppointments);
router.put(
  "/:id",
  protect,
  hasRole(["receptionist", "superadmin", "doctor"]),
  updateAppointment,
);
router.delete(
  "/:id",
  protect,
  hasRole(["receptionist", "superadmin"]),
  deleteAppointment,
);
router.post(
  "/:id/arrive",
  protect,
  hasRole(["receptionist", "superadmin", "doctor"]),
  markArrived,
);

export default router;
