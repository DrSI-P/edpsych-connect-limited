/**
 * Authentication types for EdPsych Connect
 */

export interface AuthUser {
  id: string;
  email: string;
  role?: string;
  permissions?: string[];
  lastSignInAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PasswordUpdateRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  organization?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}