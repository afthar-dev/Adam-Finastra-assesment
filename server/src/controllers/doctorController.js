import Doctor from "../models/doctorModel.js";

export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("userId", "name email");

    if (doctors.length === 0) {
      return res.status(404).json({
        message: "No doctors found",
      });
    }

    res.status(200).json({
      message: "Doctors fetched successfully",
      data: doctors,
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};
