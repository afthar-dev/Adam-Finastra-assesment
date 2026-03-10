import { create } from "zustand";
import axios from "../lib/axios.js";

export const useSlotStore = create((set) => ({
  slots: [],
  loading: false,
  error: null,

  fetchSlots: async (doctorId, date) => {
    try {
      set({ loading: true, error: null });

      const res = await axios.get("/slots", {
        params: { doctorId, date },
      });

      set({
        slots: res.data.data,
        loading: false,
      });
    } catch (error) {
      console.error("Fetch slots error:", error);

      set({
        loading: false,
        error: error.response?.data?.message || "Failed to fetch slots",
      });
    }
  },

  clearSlots: () => set({ slots: [] }),
}));
