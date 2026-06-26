import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const publicClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
});

publicClient.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);
publicClient.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error),
);


export default publicClient;