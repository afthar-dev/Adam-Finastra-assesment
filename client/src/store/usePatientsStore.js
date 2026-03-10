import { create } from "zustand";
import axios from "../lib/axios";

export const usePatientStore = create((set) => ({
  patients: [],
  patient: null,

  page: 1,
  totalPages: 1,
  totalPatients: 0,

  loading: false,
  error: null,

  /* GET PATIENTS */

  fetchPatients: async (page = 1) => {
    try {
      set({ loading: true, error: null });

      const res = await axios.get(`/patients?page=${page}`);

      set({
        patients: res.data.data,
        page: res.data.page,
        totalPages: res.data.totalPages,
        totalPatients: res.data.totalPatients,
        loading: false,
      });
    } catch (error) {
      console.error("Fetch patients error:", error);

      set({
        loading: false,
        error: error.response?.data?.message || "Failed to fetch patients",
      });
    }
  },

  /* SEARCH PATIENTS */

  searchPatients: async (query) => {
    try {
      set({ loading: true });

      const res = await axios.get(`/patients/search?query=${query}`);

      console.log("Search patients response:", res.data);

      set({
        patients: Array.isArray(res.data) ? res.data : [],
        loading: false,
      });
    } catch (error) {
      console.error("Search patients error:", error);

      set({
        loading: false,
        error: error.response?.data?.message || "Search failed",
      });
    }
  },

  /* GET SINGLE PATIENT */

  fetchPatientById: async (id) => {
    try {
      set({ loading: true });

      const res = await axios.get(`/patients/${id}`);
      console.log("Fetch patient response:", res.data);
      set({
        patient: res.data,
        loading: false,
      });
    } catch (error) {
      console.error("Fetch patient error:", error);

      set({
        loading: false,
        error: error.response?.data?.message || "Failed to fetch patient",
      });
    }
  },

  /* CREATE PATIENT */

  createPatient: async (payload) => {
    try {
      const res = await axios.post("/patients", payload);

      set((state) => ({
        patients: [res.data.data, ...state.patients],
      }));

      return res.data;
    } catch (error) {
      console.error("Create patient error:", error);

      throw error.response?.data?.message || "Failed to create patient";
    }
  },

  /* UPDATE PATIENT */

  updatePatient: async (id, payload) => {
    try {
      const res = await axios.put(`/patients/${id}`, payload);

      set((state) => ({
        patients: state.patients.map((p) => (p._id === id ? res.data : p)),
      }));

      return res.data;
    } catch (error) {
      console.error("Update patient error:", error);

      throw error.response?.data?.message || "Failed to update patient";
    }
  },

  /* DELETE PATIENT */

  deletePatient: async (id) => {
    try {
      await axios.delete(`/patients/${id}`);

      set((state) => ({
        patients: state.patients.filter((p) => p._id !== id),
      }));
    } catch (error) {
      console.error("Delete patient error:", error);

      throw error.response?.data?.message || "Failed to delete patient";
    }
  },

  /* CLEAR SELECTED PATIENT */

  clearPatient: () => set({ patient: null }),
}));
