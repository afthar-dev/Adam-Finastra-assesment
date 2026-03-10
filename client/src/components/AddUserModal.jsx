import { useEffect, useState } from "react";
import { ModalWrapper } from "./Modalwrapper";
import { useAdminStore } from "../store/useAdminStore";
import { Stethoscope, User2, Coffee } from "lucide-react";
import toast from "react-hot-toast";

export default function AddUserModal({ onClose, user }) {
  const { createUser, updateUser } = useAdminStore();

  const isEdit = !!user;

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "receptionist",
    department: "",
    workingHoursStart: "",
    workingHoursEnd: "",
    slotDuration: "",
    breakTimes: [],
  });

  const isDoctor = form.role === "doctor";

  /* PREFILL FORM WHEN EDITING */

  useEffect(() => {
    if (user) {
      setForm({
        name: user.username || "",
        email: user.email || "",
        password: "",
        role: user.role || "receptionist",

        department: user.department || "",
        workingHoursStart: user.workingHours?.start || "",
        workingHoursEnd: user.workingHours?.end || "",
        slotDuration: user.slotDuration || "",

        breakTimes: user.breakTimes || [],
      });
    }
  }, [user]);

  /* SUBMIT */

  const handleSubmit = async () => {
    if (!form.name || !form.email) {
      toast.error("Name and email required");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: form.name,
        email: form.email,
        role: form.role,
      };

      if (form.password) {
        payload.password = form.password;
      }

      if (isDoctor) {
        payload.department = form.department;

        payload.workingHours = {
          start: form.workingHoursStart,
          end: form.workingHoursEnd,
        };

        payload.slotDuration = Number(form.slotDuration);

        payload.breakTimes = form.breakTimes.filter((b) => b.start && b.end);
      }

      if (isEdit) {
        await updateUser(user._id, payload);
        toast.success("User updated");
      } else {
        await createUser(payload);
        toast.success("User created");
      }

      onClose();
    } catch (err) {
      toast.error("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper
      title={isEdit ? "Edit User" : "Create User"}
      onClose={onClose}
    >
      <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-2">
        {/* HEADER */}

        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            {isEdit ? "Edit Staff Account" : "New Staff Account"}
          </h2>

          <p className="text-sm text-slate-500">
            {isEdit
              ? "Update staff account information"
              : "Create a receptionist or doctor profile"}
          </p>
        </div>

        {/* ROLE SELECTOR */}

        {!isEdit && (
          <div className="grid grid-cols-2 gap-3">
            <RoleCard
              active={form.role === "receptionist"}
              label="Receptionist"
              icon={<User2 size={18} />}
              onClick={() => setForm({ ...form, role: "receptionist" })}
            />

            <RoleCard
              active={form.role === "doctor"}
              label="Doctor"
              icon={<Stethoscope size={18} />}
              onClick={() => setForm({ ...form, role: "doctor" })}
            />
          </div>
        )}

        {/* USER INFO */}

        <Card title="Account Information">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
            />

            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(v) => setForm({ ...form, email: v })}
            />
          </div>

          <Input
            label={isEdit ? "New Password (optional)" : "Password"}
            type="password"
            value={form.password}
            onChange={(v) => setForm({ ...form, password: v })}
          />
        </Card>

        {/* DOCTOR CONFIG */}

        {isDoctor && (
          <Card title="Doctor Configuration">
            <Input
              label="Department"
              value={form.department}
              onChange={(v) => setForm({ ...form, department: v })}
            />

            <div className="grid grid-cols-2 gap-4">
              <TimeInput
                label="Start Time"
                value={form.workingHoursStart}
                onChange={(v) =>
                  setForm({
                    ...form,
                    workingHoursStart: v,
                  })
                }
              />

              <TimeInput
                label="End Time"
                value={form.workingHoursEnd}
                onChange={(v) =>
                  setForm({
                    ...form,
                    workingHoursEnd: v,
                  })
                }
              />
            </div>

            <Input
              label="Slot Duration (minutes)"
              type="number"
              value={form.slotDuration}
              onChange={(v) =>
                setForm({
                  ...form,
                  slotDuration: v,
                })
              }
            />

            <BreakTimesEditor breakTimes={form.breakTimes} setForm={setForm} />
          </Card>
        )}

        {/* ACTIONS */}

        <div className="flex justify-end gap-3 pt-2 border-t pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-sm hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={handleSubmit}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm"
          >
            {loading
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
                ? "Update User"
                : "Create User"}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}

/* ROLE CARD */

function RoleCard({ label, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 p-3 rounded-lg border transition
      ${
        active
          ? "border-blue-500 bg-blue-50 text-blue-700"
          : "border-slate-200 hover:bg-slate-50"
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

/* BREAK TIMES */

function BreakTimesEditor({ breakTimes, setForm }) {
  const addBreak = () => {
    setForm((prev) => ({
      ...prev,
      breakTimes: [...prev.breakTimes, { start: "", end: "" }],
    }));
  };

  const updateBreak = (i, field, value) => {
    setForm((prev) => {
      const updated = [...prev.breakTimes];
      updated[i][field] = value;
      return { ...prev, breakTimes: updated };
    });
  };

  const removeBreak = (i) => {
    setForm((prev) => ({
      ...prev,
      breakTimes: prev.breakTimes.filter((_, index) => index !== i),
    }));
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center text-sm font-medium text-slate-700">
        <span className="flex items-center gap-2">
          <Coffee size={16} />
          Break Times
        </span>

        <button
          type="button"
          onClick={addBreak}
          className="text-blue-600 text-sm hover:text-blue-700"
        >
          + Add Break
        </button>
      </div>

      {breakTimes.length === 0 && (
        <p className="text-xs text-slate-400">No break times configured</p>
      )}

      {breakTimes.map((b, i) => (
        <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
          <input
            type="time"
            value={b.start}
            onChange={(e) => updateBreak(i, "start", e.target.value)}
            className="border rounded-lg px-2 py-1 text-sm"
          />

          <input
            type="time"
            value={b.end}
            onChange={(e) => updateBreak(i, "end", e.target.value)}
            className="border rounded-lg px-2 py-1 text-sm"
          />

          <button
            onClick={() => removeBreak(i)}
            className="text-red-500 text-sm"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

/* UI */

function Card({ title, children }) {
  return (
    <div className="bg-white shadow-sm rounded-lg p-4 space-y-4 border border-slate-100">
      <div className="text-sm font-semibold text-slate-700">{title}</div>
      {children}
    </div>
  );
}

function Input({ label, type = "text", value, onChange }) {
  return (
    <div>
      <label className="text-sm text-slate-600 mb-1 block">{label}</label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function TimeInput({ label, value, onChange }) {
  return (
    <div>
      <label className="text-sm text-slate-600 mb-1 block">{label}</label>

      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
      />
    </div>
  );
}
