import axios from "axios";

// Determine the base URL based on the environment
const baseURL = typeof window === "undefined"
    ? "http://localhost:5173/api" // Server-side
    : "/api"; // Client-side

const request = axios.create({
    baseURL,
    timeout: 10000,
});

// Response interceptor
request.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        console.error("Request error:", error);
        return Promise.reject(error);
    }
);

export default request;
