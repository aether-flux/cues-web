import { create } from "zustand"
import { User } from "@/utils/types"

interface AuthStore {
  accessToken: string | null;
  user: User | null;
  isLoaded: boolean;
  setAuth: (accessToken: string, user: User) => void;
  clearAuth: () => void;
  loadFromLocalStorage: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  user: null,
  isLoaded: false,

  setAuth: (accessToken, user) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(user));
    set({ accessToken, user });
  },
  clearAuth: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    set({ accessToken: null, user: null });
  },
  loadFromLocalStorage: () => {
    const token = localStorage.getItem("accessToken");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      try {
        set({ accessToken: token, user: userStr ? JSON.parse(userStr) : null, isLoaded: true });
      } catch (e) {
        localStorage.clear();
      }
    }
  }
}))
