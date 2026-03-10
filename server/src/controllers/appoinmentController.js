import Appointment from "../models/appoinmentSchema.js";
import { logAction } from "../utils/auditLogger.js";
import Doctor from "../models/doctorModel.js";

export const createAppointment = async (req, res) => {
  try {
    const { doctorId, patientId, slotTime, date, purpose } = req.body;

    if (!doctorId || !patientId || !slotTime || !date) {
      return res
        .status(400)
        .json({ message: "doctorId, patientId, date and slotTime required" });
    }

    const slotDateTime = new Date(`${date}T${slotTime}:00`);

    if (isNaN(slotDateTime.getTime())) {
      return res.status(400).json({ message: "Invalid slot time" });
    }

    const appointment = await Appointment.create({
      doctorId,
      patientId,
      slotTime: slotDateTime,
      purpose,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Appointment booked successfully",
      data: appointment,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "This slot is already booked" });
    }

    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getAppointments = async (req, res) => {
  try {
    const { role, _id } = req.user;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    let filter = {};

    if (role === "doctor") {
      const doctor = await Doctor.findOne({ userId: _id });

      if (!doctor) {
        return res.status(404).json({
          message: "Doctor profile not found",
        });
      }

      filter.doctorId = doctor._id;
    }

    const appointments = await Appointment.find(filter)
      .populate("doctorId", "name department")
      .populate("patientId", "name mobile")
      .sort({ slotTime: 1 })
      .skip(skip)
      .limit(limit);

    const totalAppointments = await Appointment.countDocuments(filter);

    res.json({
      page,
      limit,
      totalAppointments,
      totalPages: Math.ceil(totalAppointments / limit),
      data: appointments,
    });
  } catch (error) {
    console.error("Fetch appointments error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const { purpose, notes } = req.body;

    const updateData = {
      ...(purpose && { purpose }),
      ...(notes && { notes }),
    };

    const appointment = await Appointment.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    res.json({
      message: "Appointment updated successfully",
      data: appointment,
    });
  } catch (error) {
    console.error("Update appointment error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    res.json({
      message: "Appointment deleted",
    });
  } catch (error) {
    console.error("Delete appointment error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const markArrived = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "arrived" },
      { returnDocument: "after" },
    );

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    res.json({
      message: "Patient marked as arrived",
      data: appointment,
    });
  } catch (error) {
    console.error("Arrival update error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};
