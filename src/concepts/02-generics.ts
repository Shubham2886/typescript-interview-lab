// ============================================================
// TOPIC 2: Generics
// ============================================================
// INTERVIEW QUESTIONS:
// Q1. What are generics in TypeScript? Why do we need them?
// Q2. What is the difference between <T> and <T extends object>?
// Q3. How do you use generics in functions, interfaces, and classes?
// Q4. What is a generic constraint? Give an example.
// Q5. What does T extends keyof U mean?
// ============================================================

// ============================================================
// 2A. GENERIC FUNCTION
// Without generics — loses type info
function getFirstAny(arr: any[]): any {
  return arr[0]; // return type is 'any' — bad!
}

// With generics — keeps type info ✅
function getFirst<T>(arr: T[]): T {
  return arr[0];
}

const firstNum = getFirst([1, 2, 3]);      // TypeScript knows: number
const firstName = getFirst(["a", "b"]);    // TypeScript knows: string

// ============================================================
// 2B. GENERIC INTERFACE — API Response wrapper (real world pattern!)
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
  statusCode: number;
}

interface UserData {
  id: number;
  name: string;
  email: string;
}

// Now ApiResponse is reusable for any data shape
const userResponse: ApiResponse<UserData> = {
  data: { id: 1, name: "Shubham", email: "s@example.com" },
  success: true,
  message: "User fetched",
  statusCode: 200,
};

const listResponse: ApiResponse<UserData[]> = {
  data: [{ id: 1, name: "Shubham", email: "s@example.com" }],
  success: true,
  message: "Users fetched",
  statusCode: 200,
};

// ============================================================
// 2C. GENERIC CONSTRAINT — T must have certain shape
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]; // safe — TypeScript guarantees key exists on T
}

const user = { id: 1, name: "Shubham", email: "s@example.com" };
const name = getProperty(user, "name");  // string
const id = getProperty(user, "id");      // number
// getProperty(user, "xyz"); // ❌ Error! 'xyz' not in user

// ============================================================
// 2D. GENERIC CLASS — Repository Pattern (real backend pattern!)
class Repository<T extends { id: number }> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  findById(id: number): T | undefined {
    return this.items.find((item) => item.id === id);
  }

  getAll(): T[] {
    return this.items;
  }

  delete(id: number): void {
    this.items = this.items.filter((item) => item.id !== id);
  }
}

// Works for any entity with id!
const userRepo = new Repository<UserData>();
userRepo.add({ id: 1, name: "Shubham", email: "s@example.com" });
userRepo.add({ id: 2, name: "Admin", email: "admin@example.com" });

console.log("=== 02: Generics ===");
console.log("First number:", firstNum);
console.log("User response:", userResponse);
console.log("Find user by ID 1:", userRepo.findById(1));
console.log("All users:", userRepo.getAll());

// ============================================================
// INTERVIEW ANSWER SUMMARY:
// - Generics make code reusable while keeping type safety
// - <T> = placeholder type resolved at call time
// - <T extends X> = constrain T to have shape of X
// - keyof T = union of all keys of T
// - Real pattern: generic ApiResponse<T>, Repository<T>
// ============================================================

export { ApiResponse, Repository };
