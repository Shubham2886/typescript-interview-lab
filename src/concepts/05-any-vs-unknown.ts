// ============================================================
// TOPIC 5: any vs unknown
// ============================================================
// INTERVIEW QUESTIONS:
// Q1. What is the difference between any and unknown?
// Q2. Why is unknown safer than any?
// Q3. When would you actually use unknown?
// Q4. What is never? How is it different?
// Q5. When should you use any? (almost never — explain why)
// ============================================================

// ============================================================
// 5A. 'any' — DISABLES type checking (dangerous!)
let danger: any = "hello";
danger = 42;           // ok
danger = { x: 1 };    // ok
// danger.foo.bar.baz;   // TypeScript allows this — RUNTIME CRASH! (commented to not crash demo)
// danger();             // TypeScript allows this — RUNTIME CRASH! (commented to not crash demo)

// ============================================================
// 5B. 'unknown' — SAFE version of any
// You must check the type before using it!
let safeVal: unknown = "hello";
safeVal = 42;           // reassign ok
// safeVal.toUpperCase(); // ❌ Error — must narrow type first!
// safeVal();             // ❌ Error — TypeScript catches this!

// ✅ Must narrow before use
if (typeof safeVal === "string") {
  console.log(safeVal.toUpperCase()); // safe!
}

// ============================================================
// 5C. REAL USE CASE: API error handling with unknown
// When you catch errors, TypeScript types them as 'unknown' in strict mode

function handleError(error: unknown): string {
  // You MUST check before accessing .message
  if (error instanceof Error) {
    return error.message; // ✅ safe
  }
  if (typeof error === "string") {
    return error; // ✅ safe
  }
  return "An unknown error occurred";
}

// ============================================================
// 5D. REAL USE CASE: parsing external data (JSON from API)
function parseUserData(raw: unknown): { name: string; email: string } | null {
  // Validate before using — unknown forces you to be careful
  if (
    typeof raw === "object" &&
    raw !== null &&
    "name" in raw &&
    "email" in raw &&
    typeof (raw as any).name === "string" &&
    typeof (raw as any).email === "string"
  ) {
    return raw as { name: string; email: string };
  }
  return null;
}

// ============================================================
// 5E. 'never' — a value that NEVER occurs
// Used in: exhaustive checks, functions that always throw

type Shape = "circle" | "square" | "triangle";

function getArea(shape: Shape): number {
  switch (shape) {
    case "circle": return Math.PI * 5 * 5;
    case "square": return 5 * 5;
    case "triangle": return 0.5 * 5 * 5;
    default:
      // If you add a new shape and forget the case, TS errors here!
      const _exhaustive: never = shape;
      throw new Error(`Unhandled shape: ${_exhaustive}`);
  }
}

// Function that never returns (always throws)
function throwError(msg: string): never {
  throw new Error(msg);
}

// ============================================================
console.log("=== 05: any vs unknown ===");
console.log("Handle Error (Error object):", handleError(new Error("DB connection failed")));
console.log("Handle Error (string):", handleError("timeout"));
console.log("Parse valid data:", parseUserData({ name: "Shubham", email: "s@example.com" }));
console.log("Parse invalid data:", parseUserData({ foo: "bar" }));
console.log("Circle area:", getArea("circle"));

// ============================================================
// INTERVIEW ANSWER SUMMARY:
// 'any'     → disables TypeScript (avoid it) — escape hatch only
// 'unknown' → type-safe any; must narrow before use
// 'never'   → value that never exists; exhaustive checks, throw functions
// Real pattern: catch (e: unknown) → check instanceof Error before .message
// ============================================================

export { handleError, parseUserData };
