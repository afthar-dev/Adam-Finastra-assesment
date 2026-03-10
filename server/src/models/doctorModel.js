import mongoose from "mongoose";

const breakSchema = new mongoose.Schema({
  start: String,
  end: String,
});

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    department: {
      type: String,
      required: true,
    },

    workingHours: {
      start: String,
      end: String,
    },

    slotDuration: {
      type: Number,
      default: 15,
    },

    breakTimes: [breakSchema],
  },
  { timestamps: true },
);

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
