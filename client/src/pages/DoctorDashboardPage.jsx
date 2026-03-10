import { useEffect } from "react";
import { CalendarDays, Clock, User, CheckCircle } from "lucide-react";

import { useAppointmentStore } from "../store/useAppoinmentStore";

export default function DoctorDashboardPage() {
  const { appointments, fetchAppointments } = useAppointmentStore();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const today = new Date().toDateString();

  const todaysAppointments = appointments.filter(
    (a) => new Date(a.slotTime).toDateString() === today,
  );

  const completed = appointments.filter((a) => a.status === "arrived");

  const upcoming = appointments.filter((a) => a.status !== "arrived");
  const queue = todaysAppointments.filter((a) => a.status === "upcoming");

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      {/* HEADER */}

      <div>
        <h1 className="text-2xl font-semibold text-slate-800">
          Doctor Dashboard
        </h1>

        <p className="text-sm text-slate-500">Manage today's consultations</p>
      </div>

      {/* STATS */}

      <div className="grid md:grid-cols-3 gap-5">
        <StatCard
          icon={<CalendarDays size={18} />}
          label="Today's Appointments"
          value={todaysAppointments.length}
        />

        <StatCard
          icon={<CheckCircle size={18} />}
          label="Completed"
          value={completed.length}
        />

        <StatCard
          icon={<Clock size={18} />}
          label="Upcoming"
          value={upcoming.length}
        />
      </div>

      {/* PATIENT QUEUE */}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* PATIENT QUEUE */}

        <DashboardCard
          title="Patient Queue"
          count={queue.length}
          empty="No patients waiting today"
        >
          {queue.map((a) => (
            <QueueItem key={a._id} appointment={a} />
          ))}
        </DashboardCard>

        {/* UPCOMING APPOINTMENTS */}

        <DashboardCard
          title="Upcoming Appointments"
          count={appointments.length}
          empty="No upcoming appointments"
        >
          {appointments.slice(0, 5).map((a) => (
            <AppointmentItem key={a._id} appointment={a} />
          ))}
        </DashboardCard>
      </div>
    </div>
  );
}

function QueueItem({ appointment }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 hover:bg-slate-50">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
          <User size={16} className="text-blue-600" />
        </div>

        <div>
          <p className="text-sm font-medium text-slate-700">
            {appointment.patientId?.name}
          </p>

          <p className="text-xs text-slate-400">
            {appointment.patientId?.mobile}
          </p>
        </div>
      </div>

      <div className="text-sm text-slate-500">
        {new Date(appointment.slotTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  );
}

function AppointmentItem({ appointment }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
      <div>
        <p className="text-sm font-medium text-slate-700">
          {appointment.patientId?.name}
        </p>

        <p className="text-xs text-slate-400">
          {appointment.purpose || "General consultation"}
        </p>
      </div>

      <div className="text-sm text-slate-500">
        {new Date(appointment.slotTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white border border-slate-100 rounded-lg p-5 shadow-sm flex items-center gap-4">
      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
        {icon}
      </div>

      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-lg font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function DashboardCard({ title, count, children, empty }) {
  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-sm flex flex-col">
      {/* Header */}

      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>

        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
          {count}
        </span>
      </div>

      {/* Content */}

      <div className="max-h-[340px] overflow-y-auto divide-y divide-slate-100">
        {count === 0 ? (
          <p className="p-6 text-sm text-slate-400 text-center">{empty}</p>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
