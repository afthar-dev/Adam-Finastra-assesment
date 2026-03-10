import { useState, useEffect } from "react";
import { useAppointmentStore } from "../store/useAppoinmentStore";
import { ModalWrapper } from "./Modalwrapper";

export default function EditAppointmentModal({ appointment, onClose }) {
  const { updateAppointment } = useAppointmentStore();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    purpose: "",
    notes: "",
  });

  useEffect(() => {
    if (appointment) {
      setForm({
        purpose: appointment.purpose || "",
        notes: appointment.notes || "",
      });
    }
  }, [appointment]);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await updateAppointment(appointment._id, form);

      onClose();
    } catch (err) {
      console.error("Update appointment error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper title="Update Appointment" onClose={onClose}>
      <div className="space-y-5">
        <div>
          <p className="text-sm text-slate-500 mb-2">
            Add purpose or consultation notes
          </p>
        </div>

        {/* Purpose */}

        <div>
          <label className="text-sm text-slate-600 block mb-1">Purpose</label>

          <input
            value={form.purpose}
            onChange={(e) => setForm({ ...form, purpose: e.target.value })}
            placeholder="Reason for visit"
            className="
              w-full
              border border-slate-200
              rounded-lg
              px-3 py-2
              text-sm
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />
        </div>

        {/* Notes */}

        <div>
          <label className="text-sm text-slate-600 block mb-1">Notes</label>

          <textarea
            rows={5}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Doctor consultation notes..."
            className="
              w-full
              border border-slate-200
              rounded-lg
              px-3 py-2
              text-sm
              resize-none
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />
        </div>

        {/* Buttons */}

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="
              px-4 py-2
              border
              rounded-lg
              text-sm
              hover:bg-slate-50
            "
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={handleSubmit}
            className="
              bg-blue-600
              hover:bg-blue-700
              text-white
              px-5 py-2
              rounded-lg
              text-sm
            "
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}
