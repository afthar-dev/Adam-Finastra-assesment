import { useEffect } from "react";
import {
  CalendarDays,
  UserPlus,
  Clock,
  CheckCircle,
  Calendar,
} from "lucide-react";

import { useAppointmentStore } from "../store/useAppoinmentStore";
import { usePatientStore } from "../store/usePatientsStore";

export default function ReceptionistDashboardPage() {
  const { appointments, fetchAppointments } = useAppointmentStore();
  const { patients, fetchPatients } = usePatientStore();

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
  }, []);

  const now = new Date();

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);

  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  const endOfTomorrow = new Date(endOfToday);
  endOfTomorrow.setDate(endOfTomorrow.getDate() + 1);

  /* Today */

  const todaysAppointments = appointments.filter((a) => {
    const t = new Date(a.slotTime);
    return t >= startOfToday && t <= endOfToday;
  });

  /* Tomorrow */

  const tomorrowsAppointments = appointments.filter((a) => {
    const t = new Date(a.slotTime);
    return t >= startOfTomorrow && t <= endOfTomorrow;
  });

  /* Upcoming (future) */

  const upcomingAppointments = appointments.filter(
    (a) => new Date(a.slotTime) > now,
  );

  const arrived = todaysAppointments.filter((a) => a.status === "arrived");
  const waiting = todaysAppointments.filter((a) => a.status !== "arrived");

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">
          Reception Dashboard
        </h1>
        <p className="text-sm text-slate-500">
          Manage patients and appointments
        </p>
      </div>

      {/* Stats */}

      <div className="grid md:grid-cols-5 gap-5">
        <StatCard
          icon={<CalendarDays size={18} />}
          label="Today's Appointments"
          value={todaysAppointments.length}
        />
        <StatCard
          icon={<Calendar size={18} />}
          label="Tomorrow"
          value={tomorrowsAppointments.length}
        />
        <StatCard
          icon={<Clock size={18} />}
          label="Upcoming"
          value={upcomingAppointments.length}
        />
        <StatCard
          icon={<CheckCircle size={18} />}
          label="Arrived"
          value={arrived.length}
        />
        <StatCard
          icon={<UserPlus size={18} />}
          label="Total Patients"
          value={patients.length}
        />
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Waiting Queue */}

        <DashboardCard
          title="Waiting Queue"
          count={waiting.length}
          empty="No patients waiting"
        >
          {waiting.map((a) => (
            <QueueItem key={a._id} appointment={a} />
          ))}
        </DashboardCard>

        {/* Today's Schedule */}

        <DashboardCard
          title="Today's Schedule"
          count={todaysAppointments.length}
          empty="No appointments today"
        >
          {todaysAppointments.map((a) => (
            <ScheduleItem key={a._id} appointment={a} />
          ))}
        </DashboardCard>

        {/* Tomorrow's Appointments */}

        <DashboardCard
          title="Tomorrow"
          count={tomorrowsAppointments.length}
          empty="No appointments tomorrow"
        >
          {tomorrowsAppointments.map((a) => (
            <ScheduleItem key={a._id} appointment={a} />
          ))}
        </DashboardCard>
      </div>
    </div>
  );
}

function QueueItem({ appointment }) {
  return (
    <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 hover:bg-slate-50">
      <div>
        <p className="text-sm font-medium text-slate-700">
          {appointment.patientId?.name}
        </p>

        <p className="text-xs text-slate-400">
          {appointment.patientId?.mobile}
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

function ScheduleItem({ appointment }) {
  return (
    <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
      <div>
        <p className="text-sm font-medium text-slate-700">
          {appointment.patientId?.name}
        </p>

        <p className="text-xs text-slate-400">
          Dr. {appointment.doctorId?.name}
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
