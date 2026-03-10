import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.PROD
    ? "https://adam-finastra-assesment.onrender.com/api"
    : "http://localhost:5000/api",
  withCredentials: true,
});

export default axiosInstance;
