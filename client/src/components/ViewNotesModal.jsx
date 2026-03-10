import { ModalWrapper } from "./Modalwrapper";

export default function ViewNotesModal({ appointment, onClose }) {
  if (!appointment) return null;

  return (
    <ModalWrapper title="Consultation Notes" onClose={onClose}>
      <div className="space-y-5">
        {/* Patient */}

        <div>
          <p className="text-xs text-slate-500">Patient</p>
          <p className="text-sm font-medium text-slate-800">
            {appointment.patientId?.name}
          </p>
        </div>

        {/* Appointment Time */}

        <div>
          <p className="text-xs text-slate-500">Appointment Time</p>
          <p className="text-sm text-slate-700">
            {new Date(appointment.slotTime).toLocaleString()}
          </p>
        </div>

        {/* Purpose */}

        <div>
          <p className="text-xs text-slate-500">Purpose</p>
          <p className="text-sm text-slate-700">
            {appointment.purpose || "Not specified"}
          </p>
        </div>

        {/* Notes */}

        <div>
          <p className="text-xs text-slate-500">Doctor Notes</p>

          <div className="mt-1 p-3 bg-slate-50 rounded-lg text-sm text-slate-700 whitespace-pre-wrap">
            {appointment.notes || "No consultation notes added."}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg text-sm hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}
