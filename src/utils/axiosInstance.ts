import axios from "axios";

const getAuthToken = (): string | null => localStorage.getItem("jwtToken");

const url = import.meta.env.VITE_BACKEND_PORT;

const axiosInstance = axios.create({
  baseURL: url,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
