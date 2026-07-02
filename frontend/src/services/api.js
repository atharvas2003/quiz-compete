import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {

    const auth = JSON.parse(
    localStorage.getItem("auth")
);

const token = auth?.token;
    console.log("TOKEN:", token);

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(config.headers);

    return config;
});

export default api;