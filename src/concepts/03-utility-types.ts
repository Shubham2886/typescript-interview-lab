// ============================================================
// TOPIC 3: Utility Types — Partial, Pick, Omit, Required, Readonly
// ============================================================
// INTERVIEW QUESTIONS:
// Q1. What is Partial<T>? When do you use it? (PATCH API!)
// Q2. What is Pick<T, K>? Give a real example.
// Q3. What is Omit<T, K>? How is it different from Pick?
// Q4. What is Required<T> and Readonly<T>?
// Q5. What is Record<K, V>? Give a real use case.
// Q6. How would you type a PATCH (update) endpoint?
// ============================================================

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  createdAt: Date;
}

// ============================================================
// 3A. Partial<T> — all fields become optional
// REAL USE: PATCH/update endpoint — user sends only changed fields
type UpdateUserDto = Partial<User>;

// Now you can send just one field:
const patch: UpdateUserDto = { name: "New Name" }; // valid!
// Without Partial, you'd need ALL fields in the update object

// ============================================================
// 3B. Pick<T, K> — select only specific fields
// REAL USE: response DTO — don't return sensitive data
type PublicUser = Pick<User, "id" | "name" | "email" | "role">;

// password is NOT in PublicUser — never leaks to API response!
const publicUser: PublicUser = {
  id: 1,
  name: "Shubham",
  email: "s@example.com",
  role: "user",
};

// ============================================================
// 3C. Omit<T, K> — remove specific fields
// REAL USE: CreateUserDto — don't send id/createdAt (DB generates them)
type CreateUserDto = Omit<User, "id" | "createdAt">;

const newUser: CreateUserDto = {
  name: "Shubham",
  email: "s@example.com",
  password: "hashed_pw",
  role: "user",
};

// ============================================================
// 3D. Required<T> — all fields become mandatory
// REAL USE: when you need all fields guaranteed
type FullUser = Required<User>; // opposite of Partial

// ============================================================
// 3E. Readonly<T> — prevents mutation
// REAL USE: config objects, immutable data
type ImmutableUser = Readonly<User>;

const frozenUser: ImmutableUser = {
  id: 1,
  name: "Shubham",
  email: "s@example.com",
  password: "hash",
  role: "user",
  createdAt: new Date(),
};
// frozenUser.name = "changed"; // ❌ Error! Cannot assign to readonly property

// ============================================================
// 3F. Record<K, V> — key-value map with typed keys
// REAL USE: role permissions map, caching, lookup tables
type Role = "admin" | "user" | "moderator";
type Permission = "read" | "write" | "delete";

const rolePermissions: Record<Role, Permission[]> = {
  admin: ["read", "write", "delete"],
  user: ["read"],
  moderator: ["read", "write"],
};

// REAL USE: cache object
type UserCache = Record<string, User>;

// ============================================================
// 3G. ReturnType & Parameters — extract from existing functions
function createUser(name: string, email: string, role: "user" | "admin") {
  return { id: Math.random(), name, email, role, createdAt: new Date() };
}

type CreatedUser = ReturnType<typeof createUser>;    // { id, name, email, role, createdAt }
type CreateParams = Parameters<typeof createUser>;   // [string, string, "user" | "admin"]

console.log("=== 03: Utility Types ===");
console.log("Public user (no password):", publicUser);
console.log("Create user DTO:", newUser);
console.log("Role permissions:", rolePermissions);

// ============================================================
// INTERVIEW ANSWER SUMMARY:
// Partial<T>   → PATCH endpoints, optional updates
// Pick<T,K>    → select fields, response DTOs, safe exposure
// Omit<T,K>    → remove fields, CreateDto (no id/timestamps)
// Required<T>  → force all optional fields
// Readonly<T>  → immutable data, config objects
// Record<K,V>  → lookup maps, caches, enum-keyed objects
// ============================================================

export { CreateUserDto, UpdateUserDto, PublicUser, rolePermissions };
