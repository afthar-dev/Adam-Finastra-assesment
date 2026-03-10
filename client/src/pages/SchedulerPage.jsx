import { useEffect, useState } from "react";
import { Calendar, Clock } from "lucide-react";
import { useAppointmentStore } from "../store/useAppoinmentStore";
import { useSlotStore } from "../store/useSlotStore";
import { useAdminStore } from "../store/useAdminStore";
import toast from "react-hot-toast";

export default function SchedulerPage() {
  const { doctors, patients, fetchDoctors, fetchPatients } = useAdminStore();
  const { slots, fetchSlots, loading } = useSlotStore();
  const { createAppointment } = useAppointmentStore();

  const [doctorId, setDoctorId] = useState("");
  const [patientId, setPatientId] = useState("");
  const [date, setDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");

  useEffect(() => {
    fetchDoctors();
    fetchPatients();
  }, []);

  useEffect(() => {
    if (doctorId && date) {
      fetchSlots(doctorId, date);
    }
  }, [doctorId, date]);

  const handleBook = async () => {
    if (!doctorId || !patientId || !selectedSlot || !date) {
      toast.error("Please select doctor, patient, date and slot");
      return;
    }

    const slotTime = new Date(`${date}T${selectedSlot}`);

    await createAppointment({
      doctorId,
      patientId,
      slotTime,
      purpose: "",
    });

    toast.success("Appointment booked");
    setSelectedSlot("");
    fetchSlots(doctorId, date);
  };

  return (
    <div className="max-w-6xl mx-auto py-10">
      {/* Header */}
      <div className="mb-10 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-violet-50 p-6 border border-slate-100 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-800">
          Appointment Scheduler
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Choose doctor, patient and available slot
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8 grid md:grid-cols-3 gap-4">
        {/* Date */}
        <div className="relative">
          <Calendar
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="
              pl-9 pr-3 py-2
              border border-slate-200
              rounded-lg
              text-sm
              w-full
              focus:ring-2 focus:ring-blue-500
              focus:border-blue-500
              transition
            "
          />
        </div>

        {/* Doctor */}
        <select
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          className="
            border border-slate-200
            rounded-lg
            px-3 py-2
            text-sm
            focus:ring-2 focus:ring-blue-500
            transition
          "
        >
          <option value="">Select Doctor</option>
          {doctors.map((d) => (
            <option key={d._id} value={d._id}>
              {d.name} ({d.department})
            </option>
          ))}
        </select>

        {/* Patient */}
        <select
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          className="
            border border-slate-200
            rounded-lg
            px-3 py-2
            text-sm
            focus:ring-2 focus:ring-blue-500
            transition
          "
        >
          <option value="">Select Patient</option>
          {patients.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name} ({p.mobile})
            </option>
          ))}
        </select>
      </div>

      {/* Slots */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-5 text-slate-700 font-medium">
          <Clock size={16} />
          Available Slots
        </div>

        {/* Legend */}
        <div className="flex gap-6 text-xs mb-6 text-slate-500">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-sm"></span> Available
          </span>

          <span className="flex items-center gap-2">
            <span className="w-3 h-3 bg-red-400 rounded-sm"></span> Booked
          </span>

          <span className="flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-500 rounded-sm"></span> Selected
          </span>
        </div>

        {loading && <p className="text-sm text-slate-500">Loading slots...</p>}

        {!loading && slots.length === 0 && (
          <p className="text-sm text-slate-500">
            No slots available for selected date
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          {slots.map((slot, index) => {
            const isBooked = slot.status === "booked";
            const isSelected = selectedSlot === slot.time;

            return (
              <button
                key={slot?.time || index}
                disabled={Boolean(isBooked)}
                onClick={() => !isBooked && setSelectedSlot(slot?.time)}
                className={`
    px-4 py-2
    text-sm
    rounded-lg
    border
    transition-all
    duration-200
    shadow-sm
    ${
      isBooked
        ? "border-red-200 text-red-400 bg-red-50 cursor-not-allowed"
        : isSelected
          ? "bg-blue-600 text-white border-blue-600 shadow-md"
          : "border-emerald-200 bg-emerald-50 hover:bg-blue-50 hover:border-blue-300 hover:shadow"
    }
  `}
              >
                {slot?.time || "N/A"}
              </button>
            );
          })}
        </div>
      </div>

      {/* Booking Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleBook}
          className="
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-6
            py-2.5
            rounded-lg
            text-sm
            shadow-sm
            hover:shadow-md
            transition
          "
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
}
