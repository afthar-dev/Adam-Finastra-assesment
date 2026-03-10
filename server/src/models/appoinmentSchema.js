import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    slotTime: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["booked", "arrived", "cancelled"],
      default: "booked",
    },

    purpose: String,

    notes: String,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);
appointmentSchema.index({ doctorId: 1, slotTime: 1 }, { unique: true });

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
