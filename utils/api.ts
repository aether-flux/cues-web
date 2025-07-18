import { useAuthStore } from "@/stores/authStore";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
});

const refreshApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const refreshRes = await refreshApi.post('/auth/refresh');
        const { accessToken } = refreshRes.data;

        useAuthStore.getState().setAuth(accessToken, useAuthStore.getState().user!);
        original.headers.Authorization = `Bearer ${accessToken}`;

        return api(original);
      } catch (e) {
        useAuthStore.getState().clearAuth();

        window.location.href = '/';

        toast.error("Please log in again to access dashboard.", {
          style: {
            borderRadius: '50px',
            padding: '10px 20px',
            background: '#faf9f7',
            color: '#1a1a1a',
          },
        });

        return Promise.reject(e);
        
      }
    }

    return Promise.reject(err);
  }
)

export default api;
