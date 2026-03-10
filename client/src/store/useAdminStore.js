import { create } from "zustand";
import axios from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAdminStore = create((set, get) => ({
  users: [],
  doctors: [],
  patients: [],
  logs: [],
  page: 1,
  totalPages: 1,
  totalUsers: 0,
  loading: false,
  error: null,

  /* ================= USERS ================= */

  fetchUsers: async (page = 1) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`/superadmin/users?page=${page}&limit=10`);
      set({
        users: res.data.data,
        page: res.data.page,
        totalPages: res.data.totalPages,
        totalUsers: res.data.totalUsers,
      });
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch users";
      set({ error: message });
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  },

  /* ================= SEARCH USERS ================= */

  searchUsers: async (query, page = 1) => {
    try {
      set({ loading: true });
      const res = await axios.get(
        `/superadmin/users/search?query=${query}&page=${page}&limit=10`,
      );
      set({
        users: res.data.data,
        page: res.data.page,
        totalPages: res.data.totalPages,
        totalUsers: res.data.totalUsers,
      });
    } catch (error) {
      const message = error.response?.data?.message || "Search failed";
      set({ error: message });
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  },

  /* ================= CREATE USER ================= */

  createUser: async (payload) => {
    try {
      await axios.post("/superadmin/users", payload);
      toast.success("User created successfully");
      get().fetchUsers(get().page);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create user";
      set({ error: message });
      toast.error(message);
    }
  },

  /* ================= UPDATE USER ================= */

  updateUser: async (id, payload) => {
    try {
      await axios.put(`/superadmin/users/${id}`, payload);
      toast.success("User updated successfully");
      get().fetchUsers(get().page);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update user";
      set({ error: message });
      toast.error(message);
    }
  },

  /* ================= DELETE USER ================= */

  deleteUser: async (id) => {
    try {
      await axios.delete(`/superadmin/users/${id}`);
      toast.success("User deleted");
      get().fetchUsers(get().page);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete user";
      set({ error: message });
      toast.error(message);
    }
  },

  /* ================= DOCTORS ================= */

  fetchDoctors: async () => {
    try {
      const res = await axios.get("/doctors");
      set({ doctors: res.data.data });
    } catch {
      toast.error("Failed to fetch doctors");
    }
  },

  /* ================= PATIENTS ================= */

  fetchPatients: async () => {
    try {
      const res = await axios.get("/patients");
      set({ patients: res.data.data });
    } catch {
      toast.error("Failed to fetch patients");
    }
  },

  /* ================= AUDIT LOGS ================= */

  fetchAuditLogs: async () => {
    try {
      const res = await axios.get("/audit");
      set({ logs: res.data.data });
    } catch {
      toast.error("Failed to fetch audit logs");
    }
  },
}));
