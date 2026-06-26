import axios from "axios";
import { toast } from "sonner"

const BASE_URL = import.meta.env.VITE_BASE_URL;

const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        if (error.code === "ECONNABORTED") {
            toast.error("Server is not responding!");
        }
        return Promise.reject(error);
    }
);


axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401) {
            toast.error("Unauthorized , please login again!");
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
