import { create } from "zustand";
import axios from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAppointmentStore = create((set, get) => ({
  appointments: [],
  page: 1,
  limit: 10,
  totalPages: 1,
  totalAppointments: 0,

  loading: false,
  error: null,

  fetchAppointments: async (page = 1) => {
    try {
      set({ loading: true, error: null });

      const { data } = await axios.get(`/appointments?page=${page}&limit=10`);

      set({
        appointments: data.data,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages,
        totalAppointments: data.totalAppointments,
        loading: false,
      });
    } catch (error) {
      console.error("Fetch appointments error", error);

      set({
        loading: false,
        error: error.response?.data?.message || "Failed to fetch appointments",
      });
    }
  },

  createAppointment: async (payload) => {
    try {
      const { data } = await axios.post("/appointments", payload);
      toast.success("Appointment created successfully");
      set((state) => ({
        appointments: [data.data, ...state.appointments],
      }));

      return data;
    } catch (error) {
      console.error("Create appointment error", error);
      toast.error(
        error.response?.data?.message || "Failed to create appointment",
      );
      throw error.response?.data?.message || "Failed to create appointment";
    }
  },

  updateAppointment: async (id, payload) => {
    try {
      const { data } = await axios.put(`/appointments/${id}`, payload);

      await get().fetchAppointments(get().page);

      toast.success("Appointment updated successfully");

      return data;
    } catch (error) {
      console.error("Update appointment error", error);

      throw error.response?.data?.message || "Failed to update appointment";
    }
  },

  deleteAppointment: async (id) => {
    try {
      await axios.delete(`/appointments/${id}`);

      set((state) => ({
        appointments: state.appointments.filter((a) => a._id !== id),
      }));
    } catch (error) {
      console.error("Delete appointment error", error);

      throw error.response?.data?.message || "Failed to delete appointment";
    }
  },

  markArrived: async (id) => {
    try {
      const { data } = await axios.post(`/appointments/${id}/arrive`);

      set((state) => ({
        appointments: state.appointments.map((a) =>
          a._id === id ? data.data : a,
        ),
      }));

      return data;
    } catch (error) {
      console.error("Arrival update error", error);

      throw error.response?.data?.message || "Failed to update arrival";
    }
  },
}));
