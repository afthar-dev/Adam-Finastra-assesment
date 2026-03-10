import { create } from "zustand";
import axios from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: false,
  isCheckingAuth: true,

  // Check session
  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });
      const res = await axios.get("/auth/check-auth");
      set({ user: res.data.user });
      console.log(res.data.user);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong";
      toast.error(message);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Login
  login: async (credentials) => {
    try {
      set({ loading: true });
      const res = await axios.post("/auth/login", credentials);
      get().checkAuth();
      return res.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Login failed",
        }
      );
    } finally {
      set({ loading: false });
    }
  },

  // Logout
  logout: async () => {
    try {
      await axios.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      set({
        user: null,
      });
    }
  },
}));
