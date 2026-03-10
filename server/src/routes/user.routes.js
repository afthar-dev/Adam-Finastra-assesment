import express from "express";
import { hasRole, protect } from "../middlewares/authMiddleware.js";
import {
  getUsers,
  registerUser,
  removeUser,
  searchUsers,
  updateUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/users", protect, hasRole(["superadmin"]), getUsers);
router.get("/users/search", protect, hasRole(["superadmin"]), searchUsers);
router.post("/users", protect, hasRole(["superadmin"]), registerUser);
router.put("/users/:id", protect, hasRole(["superadmin"]), updateUser);
router.delete("/users/:id", protect, hasRole(["superadmin"]), removeUser);

export default router;
