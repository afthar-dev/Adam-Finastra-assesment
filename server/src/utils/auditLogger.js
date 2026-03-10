import AuditLog from "../models/auditLogModel.js";

export const logAction = async ({
  userId,
  role,
  action,
  entity,
  entityId,
  metadata = {},
}) => {
  try {
    await AuditLog.create({
      userId,
      role,
      action,
      entity,
      entityId,
      metadata,
    });
  } catch (error) {
    console.error("Audit log error:", error);
  }
};
