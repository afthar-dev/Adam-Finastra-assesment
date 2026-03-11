import Patient from "../models/patientSchema.js";
import { logAction } from "../utils/auditLogger.js";

// helper to parse dd-mm-yyyy
const parseDOB = (dob) => {
  if (!dob) return null;
  const date = new Date(dob);
  if (isNaN(date.getTime())) {
    return null;
  }
  return date;
};

// helper to format date for response
const formatDOB = (date) => {
  if (!date) return null;
  const d = new Date(date);
  return d.toLocaleDateString("en-GB");
};

// CREATE PATIENT
export const createPatient = async (req, res) => {
  try {
    const { name, mobile, gender, dob } = req.body;
    if (!name || !mobile) {
      return res.status(400).json({
        message: "Name and mobile are required",
      });
    }
    const existingPatient = await Patient.findOne({ mobile });
    if (existingPatient) {
      return res.status(400).json({
        message: "Patient with this mobile already exists",
      });
    }
    const patient = await Patient.create({
      name,
      mobile,
      gender,
      dob: parseDOB(dob),
    });
    const response = {
      ...patient.toObject(),
      dob: formatDOB(patient.dob),
    };
    await logAction({
      userId: req.user._id,
      role: req.user.role,
      action: "CREATE_PATIENT",
      entity: "Patient",
      entityId: patient._id,
    });
    res.status(201).json({
      message: "Patient created successfully",
      data: response,
    });
  } catch (error) {
    console.error("Create patient error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// GET ALL PATIENTS WITH PAGINATION
export const getPatients = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const patients = await Patient.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPatients = await Patient.countDocuments();
    const formattedPatients = patients.map((p) => ({
      ...p.toObject(),
      dob: formatDOB(p.dob),
    }));

    res.json({
      page,
      limit,
      totalPatients,
      totalPages: Math.ceil(totalPatients / limit),
      data: formattedPatients,
    });
  } catch (error) {
    console.error("Fetch patients error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// SEARCH PATIENTS
export const searchPatients = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({
        message: "Search query required",
      });
    }

    const patients = await Patient.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { mobile: { $regex: query } },
      ],
    }).limit(10);
    const formattedPatients = patients.map((p) => ({
      ...p.toObject(),
      dob: formatDOB(p.dob),
    }));

    res.json(formattedPatients);
  } catch (error) {
    console.error("Search patient error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// GET PATIENT BY ID
export const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }
    const response = {
      ...patient.toObject(),
      dob: formatDOB(patient.dob),
    };
    res.json(response);
  } catch (error) {
    console.error("Fetch patient error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// UPDATE PATIENT
export const updatePatient = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.dob) {
      updateData.dob = new Date(updateData.dob);
    }

    const patient = await Patient.findByIdAndUpdate(req.params.id, updateData, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    const response = {
      ...patient.toObject(),
      dob: patient.dob ? patient.dob.toISOString().split("T")[0] : null,
    };

    res.json(response);
  } catch (error) {
    console.error("Update patient error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// DELETE PATIENT
export const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }
    res.json({
      message: "Patient deleted successfully",
    });
  } catch (error) {
    console.error("Delete patient error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
