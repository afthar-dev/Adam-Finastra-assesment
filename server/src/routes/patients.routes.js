import express from "express";
import {
  createPatient,
  getPatients,
  searchPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} from "../controllers/patientController.js";

import { protect, hasRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, hasRole(["receptionist", "superadmin"]), getPatients);

router.get(
  "/search",
  protect,
  hasRole(["receptionist", "superadmin"]),
  searchPatients,
);

router.get("/:id", protect, getPatientById);

router.post(
  "/",
  protect,
  hasRole(["receptionist", "superadmin"]),
  createPatient,
);

router.put(
  "/:id",
  protect,
  hasRole(["receptionist", "superadmin"]),
  updatePatient,
);

router.delete(
  "/:id",
  protect,
  hasRole(["superadmin", "receptionist"]),
  deletePatient,
);

export default router;
