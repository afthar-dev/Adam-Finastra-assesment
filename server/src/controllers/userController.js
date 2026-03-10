import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import Doctor from "../models/doctorModel.js";
import { logAction } from "../utils/auditLogger.js";

export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const filter = {
      role: { $in: ["doctor", "receptionist"] },
    };

    const users = await User.find(filter)
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const userIds = users.map((u) => u._id);

    const doctors = await Doctor.find({
      userId: { $in: userIds },
    });

    const doctorMap = {};

    doctors.forEach((doc) => {
      doctorMap[doc.userId.toString()] = doc;
    });

    const mergedUsers = users.map((u) => {
      const doc = doctorMap[u._id.toString()];

      if (!doc) return u;

      return {
        ...u.toObject(),
        department: doc.department,
        workingHours: doc.workingHours,
        slotDuration: doc.slotDuration,
        breakTimes: doc.breakTimes,
      };
    });

    const totalUsers = await User.countDocuments(filter);

    res.json({
      message: "Users fetched successfully",
      data: mergedUsers,
      page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
    });
  } catch (error) {
    console.error("Fetch users error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const registerUser = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const {
      name,
      email,
      password,
      role,
      department,
      workingHours,
      slotDuration,
      breakTimes,
    } = req.body;

    const allowedRoles = ["doctor", "receptionist"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    if (role === "doctor") {
      if (
        !department ||
        !workingHours?.start ||
        !workingHours?.end ||
        !slotDuration
      ) {
        return res.status(400).json({
          message:
            "Doctor requires department, working hours and slot duration",
        });
      }
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    session.startTransaction();

    const user = await User.create(
      [
        {
          username: name,
          email,
          password: hashedPassword,
          role,
        },
      ],
      { session },
    );

    const createdUser = user[0];

    if (role === "doctor") {
      await Doctor.create(
        [
          {
            userId: createdUser._id,
            name,
            department,
            workingHours,
            slotDuration,
            breakTimes: breakTimes || [],
          },
        ],
        { session },
      );
    }

    await logAction({
      userId: req.user._id,
      role: req.user.role,
      action: "CREATE_USER",
      entity: "User",
      entityId: createdUser._id,
    });

    await session.commitTransaction();

    res.status(201).json({
      message: "User created successfully",
      data: createdUser,
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    console.error("Register user error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  } finally {
    session.endSession();
  }
};

export const removeUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role === "doctor") {
      await Doctor.deleteOne({ userId: id });
    }

    await User.findByIdAndDelete(id);

    await logAction({
      userId: req.user._id,
      role: req.user.role,
      action: "DELETE_USER",
      entity: "User",
      entityId: id,
    });

    res.json({
      message: "User removed successfully",
    });
  } catch (error) {
    console.error("Remove user error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const filter = {
      role: { $in: ["doctor", "receptionist"] },
      $or: [
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    };

    const users = await User.find(filter)
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalUsers = await User.countDocuments(filter);

    res.json({
      message: "Users search result",
      data: users,
      page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
    });
  } catch (error) {
    console.error("Search users error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateUser = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { id } = req.params;

    const {
      name,
      email,
      password,
      department,
      workingHours,
      slotDuration,
      breakTimes,
    } = req.body;

    if (req.user.role !== "superadmin") {
      return res.status(403).json({
        message: "Only superadmin can update users",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    session.startTransaction();

    const updateData = {};

    if (name) updateData.username = name;
    if (email) updateData.email = email;

    // password change (superadmin only)
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
      runValidators: true,
      session,
    }).select("-password");

    // update doctor profile if needed
    if (user.role === "doctor") {
      const doctorUpdate = {};

      if (name) doctorUpdate.name = name;
      if (department) doctorUpdate.department = department;
      if (workingHours) doctorUpdate.workingHours = workingHours;
      if (slotDuration) doctorUpdate.slotDuration = slotDuration;
      if (breakTimes) doctorUpdate.breakTimes = breakTimes;

      await Doctor.findOneAndUpdate({ userId: id }, doctorUpdate, { session });
    }

    await logAction({
      userId: req.user._id,
      role: req.user.role,
      action: "UPDATE_USER",
      entity: "User",
      entityId: id,
    });

    await session.commitTransaction();

    res.json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    console.error("Update user error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  } finally {
    session.endSession();
  }
};
