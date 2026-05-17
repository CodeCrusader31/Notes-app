export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export interface StoredAuth extends AuthResponse {}
