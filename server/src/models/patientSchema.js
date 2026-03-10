import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    mobile: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      enum: ["male", "female"],
    },

    dob: {
      type: Date,
    },
  },
  { timestamps: true },
);

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;
