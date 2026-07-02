// ============================================================
// TOPIC 6: Type Guards
// ============================================================
// INTERVIEW QUESTIONS:
// Q1. What is a type guard in TypeScript?
// Q2. What is typeof guard vs instanceof guard?
// Q3. What is a user-defined type guard (is keyword)?
// Q4. What is discriminated union? Give an example.
// Q5. What is the 'in' operator used for in type guards?
// ============================================================

// ============================================================
// 6A. typeof guard — primitive types
function processInput(input: string | number): string {
  if (typeof input === "string") {
    return input.toUpperCase(); // TypeScript knows: string here
  }
  return input.toFixed(2);     // TypeScript knows: number here
}

// ============================================================
// 6B. instanceof guard — class instances
class DatabaseError extends Error {
  constructor(message: string, public query: string) {
    super(message);
    this.name = "DatabaseError";
  }
}

class NetworkError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = "NetworkError";
  }
}

function handleError(error: unknown): string {
  if (error instanceof DatabaseError) {
    return `DB Error: ${error.message} | Query: ${error.query}`;
  }
  if (error instanceof NetworkError) {
    return `Network Error: ${error.message} | Status: ${error.statusCode}`;
  }
  if (error instanceof Error) {
    return `Error: ${error.message}`;
  }
  return "Unknown error";
}

// ============================================================
// 6C. 'in' operator guard — check if property exists
interface Admin {
  id: number;
  name: string;
  permissions: string[];
}

interface RegularUser {
  id: number;
  name: string;
  email: string;
}

function greetUser(user: Admin | RegularUser): string {
  if ("permissions" in user) {
    // TypeScript narrows to Admin here
    return `Hello Admin ${user.name}! Permissions: ${user.permissions.join(", ")}`;
  }
  // TypeScript narrows to RegularUser here
  return `Hello ${user.name}! Email: ${user.email}`;
}

// ============================================================
// 6D. Custom Type Guard — 'value is Type' (most powerful!)
interface Cat {
  meow: () => void;
  type: "cat";
}

interface Dog {
  bark: () => void;
  type: "dog";
}

// 'pet is Cat' — user-defined type guard
function isCat(pet: Cat | Dog): pet is Cat {
  return pet.type === "cat";
}

function makeSound(pet: Cat | Dog): void {
  if (isCat(pet)) {
    pet.meow(); // TypeScript knows it's Cat
  } else {
    pet.bark(); // TypeScript knows it's Dog
  }
}

// ============================================================
// 6E. Discriminated Union — BEST PATTERN for complex types
// Add a literal 'type' field to discriminate between variants
type ApiResult =
  | { status: "success"; data: unknown }
  | { status: "error"; error: string; code: number }
  | { status: "loading" };

function renderResult(result: ApiResult): string {
  switch (result.status) {
    case "success":
      return `Data: ${JSON.stringify(result.data)}`;
    case "error":
      return `Error ${result.code}: ${result.error}`;
    case "loading":
      return "Loading...";
  }
  // TypeScript knows all cases are handled — no default needed!
}

// ============================================================
console.log("=== 06: Type Guards ===");
console.log("processInput string:", processInput("hello"));
console.log("processInput number:", processInput(3.14159));

const dbErr = new DatabaseError("Table not found", "SELECT * FROM users");
console.log("DB Error:", handleError(dbErr));

const admin: Admin = { id: 1, name: "Shubham", permissions: ["read", "write"] };
const regularUser: RegularUser = { id: 2, name: "User", email: "u@example.com" };
console.log("Admin greeting:", greetUser(admin));
console.log("User greeting:", greetUser(regularUser));

const successResult: ApiResult = { status: "success", data: { id: 1 } };
const errorResult: ApiResult = { status: "error", error: "Not found", code: 404 };
console.log("Success:", renderResult(successResult));
console.log("Error:", renderResult(errorResult));

// ============================================================
// INTERVIEW ANSWER SUMMARY:
// typeof     → primitive narrowing (string, number, boolean)
// instanceof → class instance narrowing
// 'in'       → property existence check
// 'is'       → custom user-defined type guard
// Discriminated Union → literal 'type'/'kind' field + switch = safest pattern
// ============================================================

export { handleError, greetUser, renderResult, ApiResult };
