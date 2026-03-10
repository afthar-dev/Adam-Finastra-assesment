import AuditLog from "../models/auditLogModel.js";

export const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate("userId", "name email role")
      .sort({ createdAt: -1 })
      .limit(100);
    res.json({
      message: "Audit logs retrieved successfully",
      data: logs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
