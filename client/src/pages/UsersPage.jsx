import { useEffect, useState } from "react";
import { Search, Plus, User2, Stethoscope, Trash2, Pencil } from "lucide-react";

import AddUserModal from "../components/AddUserModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

import { useAdminStore } from "../store/useAdminStore";
import toast from "react-hot-toast";

export default function UsersPage() {
  const { users, fetchUsers, deleteUser, page, totalPages } = useAdminStore();

  const [query, setQuery] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(query.toLowerCase()) ||
      u.email?.toLowerCase().includes(query.toLowerCase()),
  );

  const confirmDelete = async () => {
    try {
      await deleteUser(deleteId);
      toast.success("User deleted");
    } catch {
      toast.error("Delete failed");
    }

    setDeleteId(null);
  };

  const doctors = users.filter((u) => u.role === "doctor").length;
  const receptionists = users.filter((u) => u.role === "receptionist").length;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 space-y-8">
      {/* Header */}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Users</h1>

          <p className="text-sm text-slate-500">Manage clinic staff accounts</p>
        </div>

        <button
          onClick={() => setOpenAdd(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
        >
          <Plus size={16} />
          Add User
        </button>
      </div>

      {/* Stats */}

      <div className="grid md:grid-cols-2 gap-4">
        <StatCard
          icon={<Stethoscope size={18} />}
          label="Doctors"
          value={doctors}
        />

        <StatCard
          icon={<User2 size={18} />}
          label="Receptionists"
          value={receptionists}
        />
      </div>

      {/* Search */}

      <div className="relative max-w-md">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users..."
          className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left px-6 py-3 font-medium text-slate-600">
                Name
              </th>

              <th className="text-left px-6 py-3 font-medium text-slate-600">
                Email
              </th>

              <th className="text-left px-6 py-3 font-medium text-slate-600">
                Role
              </th>

              <th className="text-right px-6 py-3 font-medium text-slate-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map((u) => (
              <tr key={u._id} className="hover:bg-slate-50">
                {/* Name */}

                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                      {u.role === "doctor" ? (
                        <Stethoscope size={14} className="text-blue-600" />
                      ) : (
                        <User2 size={14} className="text-blue-600" />
                      )}
                    </div>

                    <span className="font-medium text-slate-700">
                      {u.username}
                    </span>
                  </div>
                </td>

                {/* Email */}

                <td className="px-6 py-4 text-slate-600">{u.email}</td>

                {/* Role */}

                <td className="px-6 py-4">
                  <span
                    className={`
                    text-xs px-2 py-1 rounded-full capitalize
                    ${
                      u.role === "doctor"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-green-50 text-green-600"
                    }
                    `}
                  >
                    {u.role}
                  </span>
                </td>

                {/* Actions */}

                <td className="px-6 py-4 flex justify-end gap-4">
                  <button
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    onClick={() => setEditingUser(u)}
                  >
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button
                    onClick={() => setDeleteId(u._id)}
                    className="text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-10 text-slate-400">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}

      <div className="flex justify-between items-center text-sm text-slate-600">
        <button
          disabled={page === 1}
          onClick={() => fetchUsers(page - 1)}
          className="px-4 py-1.5 border rounded-lg hover:bg-slate-50 disabled:opacity-50"
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => fetchUsers(page + 1)}
          className="px-4 py-1.5 border rounded-lg hover:bg-slate-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modals */}

      {openAdd && <AddUserModal onClose={() => setOpenAdd(false)} />}
      {editingUser && (
        <AddUserModal user={editingUser} onClose={() => setEditingUser(null)} />
      )}

      <DeleteConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

/* ---------- UI Components ---------- */

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white border border-slate-100 rounded-lg p-4 flex items-center gap-3 shadow-sm">
      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
        {icon}
      </div>

      <div>
        <div className="text-sm text-slate-500">{label}</div>
        <div className="text-lg font-semibold text-slate-800">{value}</div>
      </div>
    </div>
  );
}
