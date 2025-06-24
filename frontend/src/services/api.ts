import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "X-Access-Token": import.meta.env.VITE_ACCESS_TOKEN,
  },
  withCredentials: true,
});

export default api;
