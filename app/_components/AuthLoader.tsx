"use client";

import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";

export const AuthLoader = () => {
  const load = useAuthStore((s) => s.loadFromLocalStorage);

  useEffect(() => {
    load();
  }, []);

  return null;
}
