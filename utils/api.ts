import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

api.interceptors.request.use((config) => {
  // const token = localStorage.getItem('access_token');
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJkZXZAbW9kZS5jb20iLCJ1c2VybmFtZSI6ImRldm1vZGUiLCJpYXQiOjE3NTIzNTEwMjAsImV4cCI6MTc1MjM1NDYyMH0.TmKJqbCpOfTtqEYPveXX_nYzz0IN2KeGx0ocfXOcBGk";

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
