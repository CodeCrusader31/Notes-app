import { http } from "@/api/http";
import type { ApiResponse } from "@/types/api";
import type { AuthPayload, AuthResponse } from "@/types/auth";

export const authService = {
  async login(payload: AuthPayload): Promise<AuthResponse> {
    const { data } = await http.post<ApiResponse<AuthResponse>>("/auth/login", payload);
    return data.data;
  },

  async register(payload: AuthPayload): Promise<AuthResponse> {
    const { data } = await http.post<ApiResponse<AuthResponse>>("/auth/register", payload);
    return data.data;
  },
};
