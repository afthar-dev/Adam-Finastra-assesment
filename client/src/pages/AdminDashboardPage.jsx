import { useEffect, useState } from "react";
import { useAdminStore } from "../store/useAdminStore";
import AddUserModal from "../components/AddUserModal";
import AddPatientModal from "../components/AddPatientModal";

import {
  Users,
  Stethoscope,
  UserRound,
  ClipboardList,
  Activity,
  Calendar,
} from "lucide-react";
import { useAppointmentStore } from "../store/useAppoinmentStore";
import { Link } from "react-router-dom";

export default function AdminDashboardPage() {
  const {
    users,
    doctors,
    patients,
    logs,
    fetchUsers,
    fetchDoctors,
    fetchPatients,
    fetchAuditLogs,
  } = useAdminStore();
  const { appointments, fetchAppointments } = useAppointmentStore();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const [modal, setModal] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchDoctors();
    fetchPatients();
    fetchAuditLogs();
    fetchAppointments();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <Header />

        <Stats
          users={users?.length || 0}
          doctors={doctors?.length || 0}
          patients={patients?.length || 0}
          logs={logs?.length || 0}
        />

        <QuickActions setModal={setModal} />

        <TodaysAppointments appointments={appointments || []} />

        <RecentLogs logs={logs || []} />
      </div>

      {modal === "user" && <AddUserModal onClose={() => setModal(null)} />}
      {modal === "patient" && (
        <AddPatientModal onClose={() => setModal(null)} />
      )}
    </div>
  );
}

function Header() {
  return (
    <div className="mb-12">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-800">
        Clinic Dashboard
      </h1>

      <p className="text-sm text-slate-500 mt-2">
        Overview of clinic operations and activity
      </p>
    </div>
  );
}

function Stats({ users, doctors, patients, logs }) {
  const cards = [
    {
      label: "Users",
      value: users,
      icon: <Users size={18} />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Doctors",
      value: doctors,
      icon: <Stethoscope size={18} />,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Patients",
      value: patients,
      icon: <UserRound size={18} />,
      color: "bg-violet-50 text-violet-600",
    },
    {
      label: "Audit Logs",
      value: logs,
      icon: <ClipboardList size={18} />,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
      {cards.map((card) => (
        <div
          key={card.label}
          className="
          bg-white
          rounded-2xl
          p-6
          shadow-sm
          hover:shadow-md
          transition-all
          duration-200
          hover:-translate-y-[2px]
        "
        >
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}
          >
            {card.icon}
          </div>

          <p className="text-sm text-slate-500 mt-4">{card.label}</p>

          <p className="text-3xl font-semibold text-slate-800 mt-1">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function QuickActions({ setModal }) {
  const actions = [
    {
      label: "Add User",
      desc: "Create staff account",
      action: () => setModal("user"),
    },
    {
      label: "Add Patient",
      desc: "Register new patient",
      action: () => setModal("patient"),
    },
    {
      label: "Book Appointment",
      desc: "Schedule doctor visit",
      action: () => setModal("appointment"),
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-12">
      {actions.map((a) => (
        <Link
          key={a.label}
          onClick={a.action}
          to={a.label === "Book Appointment" ? "/scheduler" : "#"}
          className="
          bg-white
          rounded-2xl
          p-6
          text-left
          shadow-sm
          hover:shadow-md
          transition-all
          duration-200
          hover:-translate-y-[2px]
        "
        >
          <p className="text-slate-800 font-medium">{a.label}</p>

          <p className="text-sm text-slate-500 mt-1">{a.desc}</p>
        </Link>
      ))}
    </div>
  );
}

function RecentLogs({ logs }) {
  return (
    <div
      className="
      bg-white
      rounded-2xl
      shadow-sm
      overflow-hidden
    "
    >
      <div
        className="
        px-6 py-4
        flex items-center gap-2
        text-slate-700
        font-medium
        border-b border-slate-100
      "
      >
        <Activity size={18} />
        Recent Activity
      </div>

      {logs.length === 0 && (
        <div className="p-6 text-sm text-slate-500">No activity yet</div>
      )}

      <div className="divide-y divide-slate-100">
        {logs.slice(0, 10).map((log) => (
          <div
            key={log._id}
            className="
            px-6 py-4
            flex justify-between
            items-start
            hover:bg-slate-50
            transition
          "
          >
            <div>
              <p className="text-sm text-slate-800 font-medium">{log.action}</p>

              {log.userId && (
                <p className="text-xs text-slate-500 mt-1">
                  {log.userId.name} • {log.userId.role}
                </p>
              )}
            </div>

            <span className="text-xs text-slate-400 whitespace-nowrap">
              {new Date(log.createdAt).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TodaysAppointments({ appointments }) {
  const today = new Date().toDateString();

  const todaysAppointments = appointments.filter(
    (a) => new Date(a.slotTime).toDateString() === today,
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm mb-12 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 font-medium text-slate-700">
        <Calendar size={18} />
        Today's Appointments
      </div>

      {todaysAppointments.length === 0 && (
        <div className="p-6 text-sm text-slate-500">
          No appointments scheduled today
        </div>
      )}

      <div className="divide-y divide-slate-100">
        {todaysAppointments.map((a) => (
          <div
            key={a._id}
            className="px-6 py-4 flex justify-between items-center hover:bg-slate-50 transition"
          >
            <div>
              <p className="text-sm font-medium text-slate-800">
                {a.patientId?.name}
              </p>

              <p className="text-xs text-slate-500 mt-1">{a.doctorId?.name}</p>

              {a.purpose && (
                <p className="text-xs text-slate-400 mt-1">{a.purpose}</p>
              )}
            </div>

            <div className="text-sm font-medium text-slate-600">
              {new Date(a.slotTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
