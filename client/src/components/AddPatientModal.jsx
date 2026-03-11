import { useEffect, useState } from "react";
import { ModalWrapper } from "./Modalwrapper";
import { usePatientStore } from "../store/usePatientsStore";
import toast from "react-hot-toast";

export default function AddPatientModal({ onClose, patient }) {
  const { createPatient, updatePatient } = usePatientStore();

  const isEdit = !!patient;

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    gender: "",
    dob: "",
  });

  /* Prefill form when editing */

  useEffect(() => {
    if (patient) {
      let formattedDob = "";

      if (patient.dob) {
        const date = new Date(patient.dob);
        if (!isNaN(date)) {
          formattedDob = date.toISOString().split("T")[0];
        }
      }

      setForm({
        name: patient.name || "",
        mobile: patient.mobile || "",
        gender: patient.gender || "",
        dob: formattedDob,
      });
    }
  }, [patient]);

  const handleSubmit = async () => {
    if (!form.name || !form.mobile) {
      toast.error("Name and mobile are required");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...form,
        dob: form.dob || null,
      };

      if (isEdit) {
        await updatePatient(patient._id, payload);
        toast.success("Patient updated successfully");
      } else {
        await createPatient(payload);
        toast.success("Patient created successfully");
      }

      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper
      title={isEdit ? "Edit Patient" : "Add Patient"}
      onClose={onClose}
    >
      <div className="space-y-5">
        <Input
          label="Patient Name"
          value={form.name}
          onChange={(v) => setForm({ ...form, name: v })}
        />

        <Input
          label="Mobile Number"
          value={form.mobile}
          onChange={(v) => setForm({ ...form, mobile: v })}
        />

        {/* Gender */}

        <div>
          <label className="text-sm text-gray-600 mb-1 block">Gender</label>

          <select
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* Date of Birth */}

        <div>
          <label className="text-sm text-gray-600 mb-1 block">
            Date of Birth
          </label>

          <input
            type="date"
            max={new Date().toISOString().split("T")[0]}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={form.dob}
            onChange={(e) => setForm({ ...form, dob: e.target.value })}
          />
        </div>

        {/* Buttons */}

        <div className="flex justify-end gap-3 pt-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg text-sm"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={handleSubmit}
            className="
              bg-green-600 hover:bg-green-700
              text-white
              px-5 py-2
              rounded-lg
              text-sm
            "
          >
            {loading
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
                ? "Update Patient"
                : "Create Patient"}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div>
      <label className="text-sm text-gray-600 mb-1 block">{label}</label>

      <input
        className="w-full border rounded-lg px-3 py-2 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
