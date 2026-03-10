import express from "express";
import { hasRole, protect } from "../middlewares/authMiddleware.js";
import { getAuditLogs } from "../controllers/auditController.js";

const router = express.Router();

router.get("/", protect, hasRole("superadmin"), getAuditLogs);

export default router;
