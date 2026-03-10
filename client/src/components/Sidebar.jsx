import {
  LayoutDashboard,
  Users,
  UserRound,
  CalendarDays,
  Clock,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  Hospital,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";

const navigation = {
  superadmin: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/" },
    { label: "Users", icon: Users, path: "/users" },
    { label: "Patients", icon: UserRound, path: "/patients" },
    { label: "Appointments", icon: CalendarDays, path: "/appointments" },
    { label: "Scheduler", icon: Clock, path: "/scheduler" },
  ],

  receptionist: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/" },
    { label: "Patients", icon: UserRound, path: "/patients" },
    { label: "Appointments", icon: CalendarDays, path: "/appointments" },
    { label: "Scheduler", icon: Clock, path: "/scheduler" },
  ],

  doctor: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/" },
    { label: "My Appointments", icon: CalendarDays, path: "/appointments" },
  ],
};

export default function Sidebar({ role }) {
  const { user, logout } = useAuthStore();

  const menu = navigation[role] || [];

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}

      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={18} />
      </button>

      {/* Overlay for mobile */}

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
        fixed
        top-0
        left-0
        h-screen
        bg-white
        border-r border-slate-200
        flex flex-col
        transition-all
        duration-300
        z-50

        ${collapsed ? "w-16" : "w-64"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Logo */}

        <div className="px-4 py-5 border-b border-slate-100 flex items-center justify-between">
          {!collapsed && (
            <h1 className="text-lg font-semibold text-slate-800">
              <Hospital size={24} className="inline-block mr-2 text-blue-400" />
              EMR System
            </h1>
          )}

          {/* Collapse button */}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex text-slate-500 hover:text-slate-700"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation */}

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `
                  flex items-center gap-3
                  px-3 py-2
                  rounded-lg
                  text-sm
                  transition

                  ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-100"
                  }
                `
                }
              >
                <Icon size={18} />

                {!collapsed && item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* User Section */}

        <div className="border-t border-slate-100 p-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
              {user?.name?.charAt(0)}
            </div>

            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-800">
                  {user?.username}
                </span>

                <span className="text-xs text-slate-500 capitalize">
                  {user?.role}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={logout}
            className="
            w-full
            flex items-center gap-2
            px-3 py-2
            text-sm
            rounded-lg
            text-red-600
            hover:bg-red-50
          "
          >
            <LogOut size={16} />
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
}
