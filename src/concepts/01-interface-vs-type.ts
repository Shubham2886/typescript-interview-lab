// ============================================================
// TOPIC 1: Interface vs Type
// ============================================================
// INTERVIEW QUESTIONS:
// Q1. What is the difference between interface and type in TypeScript?
// Q2. When should you use interface over type and vice versa?
// Q3. Can interfaces be merged (declaration merging)? Can types?
// Q4. Can a type alias extend another type?
// ============================================================

// ✅ INTERFACE — best for objects / class contracts / extendable shapes
interface User {
  id: number;
  name: string;
  email: string;
}

// Interface extension (inheritance)
interface AdminUser extends User {
  role: "admin" | "superadmin";
  permissions: string[];
}

// ✅ Declaration Merging — ONLY possible with interface
interface User {
  createdAt: Date; // merged! both definitions combine into one
}

// ✅ TYPE — best for unions, intersections, primitives, tuples
type ID = string | number; // union — not possible with interface

type Status = "active" | "inactive" | "banned";

type Coordinate = [number, number]; // tuple

// Type intersection (like extending)
type SuperAdmin = AdminUser & {
  canDeleteAll: boolean;
};

// ============================================================
// REAL USAGE EXAMPLE
// ============================================================

const user: User = {
  id: 1,
  name: "Shubham",
  email: "shubham@example.com",
  createdAt: new Date(),
};

const admin: AdminUser = {
  id: 2,
  name: "Admin",
  email: "admin@example.com",
  createdAt: new Date(),
  role: "admin",
  permissions: ["read", "write", "delete"],
};

const userId: ID = "user_abc123"; // string OR number both valid

console.log("=== 01: Interface vs Type ===");
console.log("User:", user);
console.log("Admin:", admin);
console.log("UserID (string):", userId);

// ============================================================
// INTERVIEW ANSWER SUMMARY:
// - interface: objects, classes, extendable, supports declaration merging
// - type: unions, tuples, primitives, intersections, computed types
// - Both can be extended — interface uses 'extends', type uses '&'
// - Prefer interface for public API shapes, type for complex type logic
// ============================================================

export { User, AdminUser, ID, Status, SuperAdmin };
