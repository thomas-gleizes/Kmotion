import axios from "axios";

const apiService = axios.create({
  baseURL: "http://localhost:8000/api",
});

apiService.interceptors.request.use((config: any) => {
  const token = localStorage.getItem("token");

  if (token) config.headers.authorization = `Bearer ${token}`;

  return config;
});

export default apiService;
