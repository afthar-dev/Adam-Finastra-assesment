import { JWT_SECRET } from "../utils/dotenv.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Not authorized" });
    }
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: "Error checking auth :" + error.message });
    console.log(error.message);
  }
};

export const hasRole = (roles) => async (req, res, next) => {
  try {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Error checking role :" + error.message });
    console.log(error.message);
  }
};
