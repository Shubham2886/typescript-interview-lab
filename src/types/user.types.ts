// ============================================================
// Centralized Types — Real-world approach
// All application types in one place
// ============================================================

export enum UserRole {
  Admin = "ADMIN",
  User = "USER",
  Moderator = "MODERATOR",
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// DTOs — Data Transfer Objects (what API accepts/returns)
export type CreateUserDto = Omit<User, "id" | "createdAt" | "updatedAt">;
export type UpdateUserDto = Partial<Omit<User, "id" | "createdAt" | "updatedAt">>;
export type PublicUser = Omit<User, "password">;

// Generic API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message: string;
}

// Error type
export interface ApiError {
  success: false;
  error: string;
  statusCode: number;
}
