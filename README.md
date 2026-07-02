# TypeScript Interview Lab 🧪

> **Learn TypeScript concepts → See real interview questions → Build a real API**
> Node.js + Express + TypeScript — Market-ready approach

---

## 📁 Project Structure

```
typescript-interview-lab/
├── src/
│   ├── concepts/                  ← Learn each concept here
│   │   ├── 01-interface-vs-type.ts
│   │   ├── 02-generics.ts
│   │   ├── 03-utility-types.ts
│   │   ├── 04-enum.ts
│   │   ├── 05-any-vs-unknown.ts
│   │   ├── 06-type-guards.ts
│   │   └── run-all.ts             ← Run all concepts at once
│   ├── api/
│   │   ├── user.controller.ts     ← Express route handlers
│   │   └── user.service.ts        ← Business logic
│   ├── types/
│   │   └── user.types.ts          ← All shared types/interfaces
│   └── index.ts                   ← Express app entry point
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🚀 Quick Start

```bash
npm install

# Run concepts (learn mode)
npm run concepts

# Run API server (build mode)
npm run dev
```

API runs at: `http://localhost:3000`

---

## 📚 Topics — Where to Find What

| # | Topic | File | Key Concepts |
|---|-------|------|--------------|
| 1 | Interface vs Type | `concepts/01-interface-vs-type.ts` | extends, declaration merging, union |
| 2 | Generics | `concepts/02-generics.ts` | `<T>`, constraints, keyof, Repository pattern |
| 3 | Utility Types | `concepts/03-utility-types.ts` | Partial, Pick, Omit, Record, Readonly |
| 4 | Enum | `concepts/04-enum.ts` | string enum, const enum, runtime existence |
| 5 | any vs unknown | `concepts/05-any-vs-unknown.ts` | unknown, never, type narrowing |
| 6 | Type Guards | `concepts/06-type-guards.ts` | typeof, instanceof, in, is, discriminated union |
| — | Real Types | `types/user.types.ts` | DTOs, ApiResponse<T>, PaginatedResponse<T> |
| — | Real Service | `api/user.service.ts` | Partial update, PublicUser, generics in practice |
| — | Real API | `api/user.controller.ts` | Express + TypeScript, error: unknown |

---

## 🎯 Topic 1: Interface vs Type

**File:** `src/concepts/01-interface-vs-type.ts`

### What it covers
- `interface` for object shapes and class contracts
- `type` for unions, tuples, intersections, primitives
- Declaration merging (only `interface` supports this)
- `extends` vs `&` intersection

### How it works (Flow)
```
interface User { id, name, email }
       ↓
interface AdminUser extends User { role, permissions }
       ↓ (declaration merging)
interface User { createdAt }   ← merges into original User!
       ↓
type ID = string | number      ← union — only possible with type
type SuperAdmin = AdminUser & { canDeleteAll }  ← intersection
```

### Interview Questions

**Q: What is the difference between interface and type?**
> `interface` defines object shapes and supports declaration merging — you can reopen and add to it. `type` is an alias for any type expression including unions, tuples, and intersections. Both can extend, but interface uses `extends` while type uses `&`.

**Q: When should you use interface vs type?**
> Use `interface` when defining object shapes for classes or public APIs — it's extendable and mergeable. Use `type` for unions (`string | number`), tuples (`[string, number]`), or complex computed types. In practice: prefer `interface` for data shapes, `type` for type algebra.

**Q: Can interfaces be merged?**
> Yes — declaration merging. If you write `interface User` twice, TypeScript merges both definitions. Types cannot be reopened/merged.

**Q: Can a type extend another type?**
> Yes, via intersection: `type Admin = User & { role: string }`. Interface uses `extends Admin extends User`.

---

## 🎯 Topic 2: Generics

**File:** `src/concepts/02-generics.ts`

### What it covers
- Generic functions `<T>`
- Generic interfaces (ApiResponse pattern)
- Generic constraints `<T extends X>`
- `keyof T` operator
- Generic classes (Repository pattern)

### How it works (Flow)
```
function getFirst<T>(arr: T[]): T   ← T resolved at call time
           ↓
getFirst([1,2,3])    → TypeScript infers T = number
getFirst(["a","b"])  → TypeScript infers T = string
           ↓
interface ApiResponse<T> { data: T, success, message }
           ↓
ApiResponse<User>      → data is User
ApiResponse<User[]>    → data is User[]   ← same interface, reusable!
           ↓
class Repository<T extends { id: number }>
  add(item: T): void
  findById(id: number): T | undefined    ← reusable for any entity
```

### Interview Questions

**Q: What are generics? Why do we need them?**
> Generics allow writing reusable code that works with multiple types while keeping type safety. Without generics, you'd either use `any` (losing type info) or write duplicate functions for every type.

**Q: What is `<T extends object>`?**
> A generic constraint. `T extends object` means T must be an object type. `T extends { id: number }` means T must have at least an `id: number` field. This lets you safely access those properties inside the generic.

**Q: What does `K extends keyof T` mean?**
> `keyof T` is a union of all keys of T. `K extends keyof T` means K must be one of those keys. This makes `obj[key]` type-safe — TypeScript knows the key exists.

**Q: Real-world generic patterns?**
> `ApiResponse<T>` wrapper for all API responses, `Repository<T>` for data access layer, `PaginatedResponse<T>` for list endpoints.

---

## 🎯 Topic 3: Utility Types

**File:** `src/concepts/03-utility-types.ts`

### What it covers
- `Partial<T>` — all fields optional
- `Pick<T, K>` — select specific fields
- `Omit<T, K>` — remove specific fields
- `Required<T>` — all fields mandatory
- `Readonly<T>` — prevent mutation
- `Record<K, V>` — typed key-value map
- `ReturnType<T>` and `Parameters<T>`

### How it works (Flow)
```
interface User { id, name, email, password, role, createdAt }
           ↓
Partial<User>           → UpdateUserDto  (PATCH — all optional)
Omit<User, 'id'|'createdAt'>  → CreateUserDto (POST — no auto fields)
Pick<User, 'id'|'name'|'email'|'role'>  → PublicUser (no password in response!)
Readonly<User>          → ImmutableUser (config, constants)
Record<Role, Permission[]>  → rolePermissions lookup map
```

### Interview Questions

**Q: What is `Partial<T>`? When do you use it?**
> `Partial<T>` makes all fields of T optional. Real use: PATCH/update endpoints — the client only sends the fields they want to change, not the full object.

**Q: What is the difference between `Pick` and `Omit`?**
> `Pick<User, 'name'|'email'>` keeps only those fields. `Omit<User, 'password'>` removes those fields, keeps the rest. Use Pick when you know what you want; use Omit when you know what to exclude.

**Q: How would you type a PATCH endpoint?**
> `type UpdateUserDto = Partial<Omit<User, 'id' | 'createdAt'>>` — removes auto-generated fields, makes remaining fields optional.

**Q: What is `Record<K, V>`?**
> A typed object where keys are of type K and values are of type V. Example: `Record<UserRole, Permission[]>` — ensures every role has a permissions array, and only valid roles are keys.

---

## 🎯 Topic 4: Enum

**File:** `src/concepts/04-enum.ts`

### What it covers
- Numeric enum (default, starts at 0)
- String enum (preferred in production)
- `const enum` (compile-time only)
- Enum vs union type — when to use which
- Runtime iteration of enum values

### How it works (Flow)
```
enum UserRole { Admin = "ADMIN", User = "USER" }
           ↓
EXISTS AT RUNTIME — compiled to a real JS object
           ↓
Object.values(UserRole)  → ["ADMIN", "USER"]  ← can iterate!
           ↓
vs type Status = "ADMIN" | "USER"  ← erased at compile time, no runtime object
           ↓
const enum HttpStatus { OK = 200, NotFound = 404 }
           ↓
Inlined at compile time: if (code === 200) — no runtime object
```

### Interview Questions

**Q: What is an enum?**
> An enum is a way to define a set of named constants. Unlike interfaces/types which are erased at compile time, enums exist at runtime as real JavaScript objects.

**Q: String enum vs numeric enum?**
> String enums (`Admin = "ADMIN"`) are preferred in production — they're readable in databases, logs, and API responses. Numeric enums (`Up = 0`) are smaller but opaque in output.

**Q: Enum vs union type?**
> Use enum when you need runtime iteration (`Object.values()`), readable DB storage, or switch-case matching. Use union type (`"admin" | "user"`) for simple compile-time checks with no runtime need. Union types create smaller bundles.

**Q: What is a const enum?**
> `const enum` values are inlined at compile time — no JavaScript object is generated. Smaller output, but you can't iterate the values at runtime.

---

## 🎯 Topic 5: any vs unknown

**File:** `src/concepts/05-any-vs-unknown.ts`

### What it covers
- `any` — disables type checking
- `unknown` — safe version of any
- `never` — value that never occurs
- `catch (e: unknown)` pattern
- Exhaustive checking with `never`

### How it works (Flow)
```
any value         → TypeScript trusts you blindly → RUNTIME CRASH possible
           ↓
unknown value     → TypeScript forces you to check → SAFE
           ↓
if (typeof val === "string") { val.toUpperCase() }  ← must narrow first
           ↓
try { } catch (error: unknown) {           ← real pattern in strict mode
  if (error instanceof Error) {
    error.message  ← safe access after narrowing
  }
}
           ↓
never → type of values that can't exist
function throws(): never { throw new Error() }
switch exhaustive check → TypeScript errors if a case is missed
```

### Interview Questions

**Q: What is the difference between `any` and `unknown`?**
> `any` disables TypeScript — you can do anything with it and TypeScript won't complain, but you lose all safety. `unknown` is the type-safe alternative — you must check/narrow the type before using it.

**Q: Why is `unknown` safer than `any`?**
> With `unknown`, TypeScript forces you to prove the type before accessing it. You can't call methods or access properties without a type check. This prevents runtime errors.

**Q: When would you use `unknown`?**
> For values from external sources: JSON parsing, `catch` blocks (in strict mode), API responses before validation, function parameters that accept anything but should be validated before use.

**Q: What is `never`?**
> `never` represents a value that never exists — a function that always throws, a type that's impossible, or the leftover type in exhaustive checks. It's the bottom type in TypeScript's type hierarchy.

---

## 🎯 Topic 6: Type Guards

**File:** `src/concepts/06-type-guards.ts`

### What it covers
- `typeof` guard — primitive narrowing
- `instanceof` guard — class instance check
- `in` operator — property existence check
- Custom type guard (`value is Type`)
- Discriminated union pattern

### How it works (Flow)
```
function process(input: string | number)
           ↓
typeof input === "string"  → TypeScript knows: string in this block
           ↓
instanceof — checks prototype chain
error instanceof DatabaseError → knows it has .query field
           ↓
"permissions" in user → knows it's Admin (not RegularUser)
           ↓
Custom guard: function isCat(pet): pet is Cat { return pet.type === "cat" }
           ↓
Discriminated Union (BEST PATTERN):
type Result = { status: "success"; data: T } | { status: "error"; error: string }
switch(result.status) → TypeScript narrows automatically, exhaustive check!
```

### Interview Questions

**Q: What is a type guard?**
> A type guard is an expression that narrows the type within a block. TypeScript uses the check to know which type to use in each branch.

**Q: What are the types of type guards?**
> `typeof` (primitives), `instanceof` (class instances), `in` (property check), custom `is` guards (user-defined), and discriminated unions (literal field + switch).

**Q: What is a discriminated union?**
> A union of types that each have a common literal field (like `type` or `status`). Switching on that field narrows to the exact variant. TypeScript knows all cases are covered, so you get exhaustive checking for free.

**Q: When do you use a custom type guard?**
> When `typeof`/`instanceof`/`in` isn't enough — for example, checking if an object has a specific shape from an API response, or distinguishing between two interfaces that both have the same primitive fields.

---

## 🔌 REST API Endpoints

Server: `http://localhost:3000`

```
GET    /health                     Health check
GET    /api/users                  All users (paginated)
GET    /api/users?page=1&limit=5   Paginated
GET    /api/users/:id              Get by ID
GET    /api/users/role/:role       Filter by role (ADMIN/USER/MODERATOR)
POST   /api/users                  Create user
PATCH  /api/users/:id              Partial update (Partial<T> in action!)
DELETE /api/users/:id              Delete user
```

### Sample Requests

**Create User (POST)**
```json
POST /api/users
{
  "name": "Shubham Sharma",
  "email": "shubham@example.com",
  "password": "secret123",
  "role": "USER"
}
```

**Partial Update (PATCH) — only send what changes**
```json
PATCH /api/users/1
{
  "name": "Updated Name"
}
```

**Response Shape — `ApiResponse<T>` generic in action**
```json
{
  "success": true,
  "data": { "id": 1, "name": "Shubham", "email": "..." },
  "message": "User fetched",
  "statusCode": 200
}
```

---

## 🔄 How TypeScript Concepts Map to the API

| Concept | Where it's used in API |
|---------|------------------------|
| `interface` | `User`, `ApiResponse<T>`, `PaginatedResponse<T>` in `user.types.ts` |
| `type` (utility) | `CreateUserDto`, `UpdateUserDto`, `PublicUser` |
| `Partial<T>` | `UpdateUserDto = Partial<...>` — PATCH endpoint |
| `Omit<T,K>` | `CreateUserDto = Omit<User, 'id'\|'createdAt'>` — POST body |
| `Pick<T,K>` | `PublicUser = Omit<User, 'password'>` — safe response |
| `Generic <T>` | `ApiResponse<T>`, `PaginatedResponse<T>` — reusable response shape |
| `Enum` | `UserRole.Admin/User/Moderator` — roles in DB and routes |
| `unknown` | `catch (error: unknown)` — all controllers |
| `Type Guard` | `instanceof Error` in every catch block |
| `Discriminated Union` | `ApiResult` with `status: "success" \| "error" \| "loading"` |

---

## 🧠 Quick Interview Cheat Sheet

```
Interface    → objects, class contracts, extendable, declaration merging
Type         → unions, tuples, intersections, primitives
Generics     → reusable + type-safe; <T> resolved at call time
Partial<T>   → PATCH endpoints; all fields optional
Omit<T,K>    → CreateDto; remove id/timestamps
Pick<T,K>    → response DTOs; expose only safe fields
Record<K,V>  → lookup maps, role → permissions
Enum         → exists at RUNTIME; string enum preferred
any          → AVOID; disables TypeScript
unknown      → safe any; must narrow before use
never        → unreachable; exhaustive checks; always-throw functions
typeof       → primitive type guard
instanceof   → class instance guard
in           → property existence guard
pet is Cat   → custom type guard
Discriminated Union → type/status literal + switch = safest pattern
```

---

## 📦 Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript 5.x (strict mode)
- **Framework:** Express 4.x
- **Dev Tools:** ts-node, nodemon

---

## 🏗️ Architecture Flow

```
Request
   ↓
Express Router (user.controller.ts)
   ↓ typed with CreateUserDto / UpdateUserDto
Service Layer (user.service.ts)
   ↓ returns ApiResponse<PublicUser>
Types (user.types.ts)
   ↓ User, PublicUser, DTOs, enums
Response → JSON (password stripped via Omit/destructuring)
```
