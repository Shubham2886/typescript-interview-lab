// ============================================================
// TOPIC 4: Enum
// ============================================================
// INTERVIEW QUESTIONS:
// Q1. What is an enum? When should you use it vs union types?
// Q2. What is the difference between numeric and string enums?
// Q3. What is a const enum? How is it different?
// Q4. What problem does enum solve vs plain strings?
// Q5. Can enums be used at runtime? (yes — unlike types/interfaces!)
// ============================================================

// ============================================================
// 4A. Numeric Enum (default — starts at 0)
enum Direction {
  Up,    // 0
  Down,  // 1
  Left,  // 2
  Right, // 3
}

console.log("=== 04: Enums ===");
console.log("Direction.Up:", Direction.Up);          // 0
console.log("Direction[0]:", Direction[0]);           // "Up" — reverse mapping!

// ============================================================
// 4B. String Enum — PREFERRED in real projects
// Why? String enums are readable in DB, logs, API responses
enum UserRole {
  Admin = "ADMIN",
  User = "USER",
  Moderator = "MODERATOR",
}

enum OrderStatus {
  Pending = "PENDING",
  Confirmed = "CONFIRMED",
  Shipped = "SHIPPED",
  Delivered = "DELIVERED",
  Cancelled = "CANCELLED",
}

// Real usage — stored in DB, readable in logs
function processOrder(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.Pending:
      return "Order is waiting for confirmation";
    case OrderStatus.Confirmed:
      return "Order confirmed, preparing to ship";
    case OrderStatus.Shipped:
      return "Order is on the way";
    case OrderStatus.Delivered:
      return "Order delivered successfully";
    case OrderStatus.Cancelled:
      return "Order was cancelled";
    default:
      return "Unknown status";
  }
}

// ============================================================
// 4C. Const Enum — inlined at compile time (no runtime object)
// Use when you ONLY need compile-time checks, not runtime iteration
const enum HttpStatus {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  InternalServerError = 500,
}

function getStatusMessage(code: HttpStatus): string {
  if (code === HttpStatus.OK) return "Success";
  if (code === HttpStatus.NotFound) return "Not Found";
  return "Other";
}

// ============================================================
// 4D. Enum vs Union Type — INTERVIEW TRAP QUESTION
// Use ENUM when: you need runtime iteration, flags, DB values
// Use UNION when: simple, no runtime need, cleaner type-only usage

type StatusUnion = "PENDING" | "CONFIRMED" | "SHIPPED"; // no runtime object

// Iterating enum values (useful for validation!)
const allStatuses = Object.values(OrderStatus);
console.log("All order statuses:", allStatuses);

// ============================================================
console.log("Order message:", processOrder(OrderStatus.Shipped));
console.log("HTTP 404:", getStatusMessage(HttpStatus.NotFound));
console.log("User role:", UserRole.Admin);

// ============================================================
// INTERVIEW ANSWER SUMMARY:
// - Enum exists at RUNTIME (unlike interface/type which are erased)
// - String enum > numeric enum for readability in logs/DB
// - const enum = compile-time only, smaller bundle
// - Use enum for: DB status fields, roles, fixed option sets
// - Use union type for: simple type checks, no iteration needed
// ============================================================

export { UserRole, OrderStatus, HttpStatus };
