// ============================================================
// User Service — Pure TypeScript logic (no DB for simplicity)
// Shows: generics, utility types, type guards in real code
// ============================================================

import {
  User,
  CreateUserDto,
  UpdateUserDto,
  PublicUser,
  UserRole,
  ApiResponse,
  PaginatedResponse,
} from "../types/user.types";

// In-memory store (simulates DB)
let users: User[] = [
  {
    id: 1,
    name: "Shubham Sharma",
    email: "shubham@example.com",
    password: "hashed_password_1",
    role: UserRole.Admin,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: 2,
    name: "Rahul Verma",
    email: "rahul@example.com",
    password: "hashed_password_2",
    role: UserRole.User,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: 3,
    name: "Priya Singh",
    email: "priya@example.com",
    password: "hashed_password_3",
    role: UserRole.Moderator,
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-01"),
  },
];

let nextId = 4;

// Helper: strip password from user (Omit<User, 'password'>)
function toPublicUser(user: User): PublicUser {
  const { password, ...publicUser } = user; // destructure to remove password
  return publicUser;
}

// Helper: build success response (Generic function!)
function success<T>(data: T, message: string, statusCode = 200): ApiResponse<T> {
  return { success: true, data, message, statusCode };
}

// ============================================================
// SERVICE METHODS
// ============================================================

export function getAllUsers(
  page = 1,
  limit = 10
): PaginatedResponse<PublicUser> {
  const start = (page - 1) * limit;
  const paginatedUsers = users.slice(start, start + limit).map(toPublicUser);

  return {
    success: true,
    data: paginatedUsers,
    pagination: {
      page,
      limit,
      total: users.length,
      totalPages: Math.ceil(users.length / limit),
    },
    message: "Users fetched successfully",
  };
}

export function getUserById(id: number): ApiResponse<PublicUser> | null {
  const user = users.find((u) => u.id === id);
  if (!user) return null;
  return success(toPublicUser(user), "User fetched");
}

export function createUser(dto: CreateUserDto): ApiResponse<PublicUser> {
  // Check if email already exists
  const exists = users.some((u) => u.email === dto.email);
  if (exists) {
    throw new Error(`User with email ${dto.email} already exists`);
  }

  const newUser: User = {
    ...dto,
    id: nextId++,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  users.push(newUser);
  return success(toPublicUser(newUser), "User created successfully", 201);
}

export function updateUser(
  id: number,
  dto: UpdateUserDto
): ApiResponse<PublicUser> | null {
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;

  // Partial update — only update provided fields
  users[index] = {
    ...users[index],
    ...dto,
    updatedAt: new Date(),
  };

  return success(toPublicUser(users[index]), "User updated successfully");
}

export function deleteUser(id: number): boolean {
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return false;
  users.splice(index, 1);
  return true;
}

export function getUsersByRole(role: UserRole): ApiResponse<PublicUser[]> {
  const filtered = users
    .filter((u) => u.role === role)
    .map(toPublicUser);
  return success(filtered, `Users with role ${role} fetched`);
}
