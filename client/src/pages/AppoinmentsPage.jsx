import { useEffect, useState } from "react";
import {
  Clock,
  User,
  Stethoscope,
  CheckCircle,
  Trash2,
  Pencil,
  Eye,
} from "lucide-react";
import { useAppointmentStore } from "../store/useAppoinmentStore";
import toast from "react-hot-toast";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { useAuthStore } from "../store/useAuthStore";
import EditAppointmentModal from "../components/EditAppointmentModal";
import ViewNotesModal from "../components/ViewNotesModal";

export default function AppointmentsPage() {
  const {
    appointments,
    fetchAppointments,
    deleteAppointment,
    markArrived,
    page,
    totalPages,
  } = useAppointmentStore();
  const { user } = useAuthStore();

  const [deleteId, setDeleteId] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [viewingNotes, setViewingNotes] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const confirmDelete = async () => {
    await deleteAppointment(deleteId);
    toast.success("Appointment deleted");
    setDeleteId(null);
  };

  const handleArrived = async (id) => {
    await markArrived(id);
    toast.success("Patient marked as arrived");
  };

  return (
    <div className="max-w-6xl mx-auto py-10">
      {/* Header */}

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-800">Appointments</h1>

        <p className="text-sm text-slate-500 mt-1">
          View and manage clinic appointments
        </p>
      </div>

      {/* Container */}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Table */}

        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-600">
            <tr>
              <th className="text-left px-6 py-3 font-medium">Patient</th>
              <th className="text-left px-6 py-3 font-medium">Doctor</th>
              <th className="text-left px-6 py-3 font-medium">Time</th>
              <th className="text-left px-6 py-3 font-medium">Purpose</th>
              <th className="text-left px-6 py-3 font-medium">Status</th>
              <th className="text-left px-6 py-3 font-medium">Prescriptions</th>
              <th className="text-right px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {appointments.map((a) => (
              <tr key={a._id} className="hover:bg-slate-50 transition">
                {/* Patient */}

                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                      <User size={14} className="text-blue-600" />
                    </div>

                    <span className="font-medium text-slate-700">
                      {a.patientId?.name}
                    </span>
                  </div>
                </td>

                {/* Doctor */}

                <td className="px-6 py-4 text-slate-700">
                  <div className="flex items-center gap-2">
                    <Stethoscope size={14} className="text-slate-400" />

                    {a.doctorId?.name}
                  </div>
                </td>

                {/* Time */}

                <td className="px-6 py-4 text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock size={14} />

                    {new Date(a.slotTime).toLocaleString()}
                  </div>
                </td>

                {/* Purpose */}

                <td className="px-6 py-4 text-slate-500">
                  {a.purpose || "Consultation"}
                </td>

                {/* Status */}

                <td className="px-6 py-4">
                  {a.status === "arrived" ? (
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                      Arrived
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                      Scheduled
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <button
                    onClick={() => setViewingNotes(a)}
                    className="text-slate-600 hover:text-slate-800 flex items-center gap-1"
                  >
                    <Eye size={16} />
                    View
                  </button>
                </td>
                <td className="px-6 py-4 flex justify-end gap-3">
                  {a.status !== "arrived" && user.role === "doctor" && (
                    <button
                      onClick={() => handleArrived(a._id)}
                      className="flex items-center gap-1 text-green-600 hover:text-green-700 text-sm"
                    >
                      <CheckCircle size={16} />
                      Mark as Arrived
                    </button>
                  )}
                  {user.role === "doctor" && (
                    <button
                      onClick={() => setEditingAppointment(a)}
                      className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Pencil size={16} />
                      Notes
                    </button>
                  )}
                  {user.role !== "doctor" && (
                    <button
                      onClick={() => setDeleteId(a._id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}

      <div className="flex justify-between items-center mt-6 text-sm text-slate-600">
        <button
          disabled={page === 1}
          onClick={() => fetchAppointments(page - 1)}
          className="px-4 py-1.5 border rounded-lg hover:bg-slate-50 disabled:opacity-50"
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => fetchAppointments(page + 1)}
          className="px-4 py-1.5 border rounded-lg hover:bg-slate-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Delete Modal */}

      <DeleteConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
      {editingAppointment && (
        <EditAppointmentModal
          appointment={editingAppointment}
          onClose={() => setEditingAppointment(null)}
        />
      )}
      {viewingNotes && (
        <ViewNotesModal
          appointment={viewingNotes}
          onClose={() => setViewingNotes(null)}
        />
      )}
    </div>
  );
}
