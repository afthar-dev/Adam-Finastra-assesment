import { useEffect, useState } from "react";
import { Search, User, Phone, Pencil, Trash2, Plus } from "lucide-react";
import AddPatientModal from "../components/AddPatientModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import toast from "react-hot-toast";
import { usePatientStore } from "../store/usePatientsStore";
import useDebounce from "../hooks/useDebounce";

export default function PatientsPage() {
  const {
    patients,
    fetchPatients,
    searchPatients,
    deletePatient,
    page,
    totalPages,
  } = usePatientStore();

  const [query, setQuery] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    fetchPatients();
  }, []);

  /* Debounced search */

  useEffect(() => {
    if (!debouncedQuery) {
      fetchPatients();
      return;
    }

    searchPatients(debouncedQuery);
  }, [debouncedQuery]);

  /* Delete */

  const confirmDelete = async () => {
    try {
      await deletePatient(deleteId);
      toast.success("Patient deleted");
    } catch (err) {
      toast.error("Delete failed");
      console.error("Delete patient error:", err);
    }

    setDeleteId(null);
  };

  return (
    <div className="max-w-6xl mx-auto py-10">
      {/* Header */}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Patients</h1>

          <p className="text-sm text-slate-500">Manage clinic patients</p>
        </div>

        <button
          onClick={() => setOpenAdd(true)}
          className="
            flex items-center gap-2
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-4
            py-2
            rounded-lg
            text-sm
          "
        >
          <Plus size={16} />
          Add Patient
        </button>
      </div>

      {/* Search */}

      <div className="relative mb-6">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search patient by name or mobile"
          className="
            w-full
            pl-9
            pr-4
            py-2
            border border-slate-200
            rounded-lg
            text-sm
            focus:ring-2 focus:ring-blue-500
          "
        />
      </div>

      {/* Table */}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-slate-600">
                Patient
              </th>

              <th className="px-6 py-3 text-left font-medium text-slate-600">
                Mobile
              </th>

              <th className="px-6 py-3 text-left font-medium text-slate-600">
                Gender
              </th>

              <th className="px-6 py-3 text-left font-medium text-slate-600">
                DOB
              </th>

              <th className="px-6 py-3 text-right font-medium text-slate-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {patients.length > 0 ? (
              patients.map((p) => (
                <tr key={p?._id} className="hover:bg-slate-50">
                  {/* Patient */}

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                        <User size={14} className="text-blue-600" />
                      </div>

                      <span className="font-medium text-slate-700">
                        {p?.name}
                      </span>
                    </div>
                  </td>

                  {/* Mobile */}

                  <td className="px-6 py-4 text-slate-600 flex items-center gap-2">
                    <Phone size={14} />
                    {p?.mobile}
                  </td>

                  {/* Gender */}

                  <td className="px-6 py-4 text-slate-600 capitalize">
                    {p?.gender || "-"}
                  </td>

                  {/* DOB */}

                  <td className="px-6 py-4 text-slate-600">{p?.dob || "-"}</td>

                  {/* Actions */}

                  <td className="px-6 py-4 flex justify-end gap-4">
                    <button
                      onClick={() => setEditingPatient(p)}
                      className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>

                    <button
                      onClick={() => setDeleteId(p._id)}
                      className="text-red-600 hover:text-red-700 flex items-center gap-1"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-8 text-slate-400">
                  No patients found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}

      <div className="flex justify-between items-center mt-6 text-sm text-slate-600">
        <button
          disabled={page === 1}
          onClick={() => fetchPatients(page - 1)}
          className="px-4 py-1.5 border rounded-lg hover:bg-slate-50 disabled:opacity-50"
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => fetchPatients(page + 1)}
          className="px-4 py-1.5 border rounded-lg hover:bg-slate-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modals */}

      {openAdd && <AddPatientModal onClose={() => setOpenAdd(false)} />}
      {editingPatient && (
        <AddPatientModal
          patient={editingPatient}
          onClose={() => setEditingPatient(null)}
        />
      )}
      <DeleteConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
