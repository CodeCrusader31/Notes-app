import axios, { AxiosError } from "axios";

import { AUTH_STORAGE_KEY } from "@/utils/storage";
import type { ApiErrorBody } from "@/types/api";

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api/v1";

export const http = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use((config) => {
  const rawAuth = localStorage.getItem(AUTH_STORAGE_KEY);

  if (rawAuth) {
    const token = JSON.parse(rawAuth) as { token?: string };
    if (token.token) {
      config.headers.Authorization = `Bearer ${token.token}`;
    }
  }

  return config;
});

export const getApiErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const body = error.response?.data as ApiErrorBody | undefined;
    return body?.message ?? error.message ?? "Something went wrong";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
};
