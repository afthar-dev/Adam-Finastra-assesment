import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://adam-finastra-assesment.onrender.com/api",
  withCredentials: true,
});

export default axiosInstance;
