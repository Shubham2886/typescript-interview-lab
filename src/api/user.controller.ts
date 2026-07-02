// ============================================================
// User Controller — Express Route Handlers
// Shows: TypeScript with Express, proper typing, error handling
// ============================================================

import { Router, Request, Response } from "express";
import * as UserService from "./user.service";
import { CreateUserDto, UpdateUserDto, UserRole } from "../types/user.types";

const router = Router();

// ============================================================
// GET /api/users?page=1&limit=10
// ============================================================
router.get("/", (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = UserService.getAllUsers(page, limit);
    res.status(200).json(result);
  } catch (error: unknown) {
    // 'unknown' type — must check before accessing .message
    const message = error instanceof Error ? error.message : "Failed to fetch users";
    res.status(500).json({ success: false, error: message, statusCode: 500 });
  }
});

// ============================================================
// GET /api/users/role/:role
// ============================================================
router.get("/role/:role", (req: Request, res: Response) => {
  try {
    const role = req.params.role.toUpperCase() as UserRole;

    // Type guard — check if valid enum value
    if (!Object.values(UserRole).includes(role)) {
      res.status(400).json({
        success: false,
        error: `Invalid role. Must be one of: ${Object.values(UserRole).join(", ")}`,
        statusCode: 400,
      });
      return;
    }

    const result = UserService.getUsersByRole(role);
    res.status(200).json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed";
    res.status(500).json({ success: false, error: message, statusCode: 500 });
  }
});

// ============================================================
// GET /api/users/:id
// ============================================================
router.get("/:id", (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: "Invalid ID", statusCode: 400 });
      return;
    }

    const result = UserService.getUserById(id);
    if (!result) {
      res.status(404).json({ success: false, error: "User not found", statusCode: 404 });
      return;
    }

    res.status(200).json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed";
    res.status(500).json({ success: false, error: message, statusCode: 500 });
  }
});

// ============================================================
// POST /api/users
// ============================================================
router.post("/", (req: Request, res: Response) => {
  try {
    const dto = req.body as CreateUserDto;

    // Basic validation
    if (!dto.name || !dto.email || !dto.password) {
      res.status(400).json({
        success: false,
        error: "name, email, and password are required",
        statusCode: 400,
      });
      return;
    }

    // Set default role if not provided
    if (!dto.role) {
      dto.role = UserRole.User;
    }

    const result = UserService.createUser(dto);
    res.status(201).json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create user";
    const statusCode = message.includes("already exists") ? 409 : 500;
    res.status(statusCode).json({ success: false, error: message, statusCode });
  }
});

// ============================================================
// PATCH /api/users/:id  (Partial update!)
// ============================================================
router.patch("/:id", (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: "Invalid ID", statusCode: 400 });
      return;
    }

    const dto = req.body as UpdateUserDto; // Partial<User> — only provided fields!

    const result = UserService.updateUser(id, dto);
    if (!result) {
      res.status(404).json({ success: false, error: "User not found", statusCode: 404 });
      return;
    }

    res.status(200).json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update";
    res.status(500).json({ success: false, error: message, statusCode: 500 });
  }
});

// ============================================================
// DELETE /api/users/:id
// ============================================================
router.delete("/:id", (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: "Invalid ID", statusCode: 400 });
      return;
    }

    const deleted = UserService.deleteUser(id);
    if (!deleted) {
      res.status(404).json({ success: false, error: "User not found", statusCode: 404 });
      return;
    }

    res.status(200).json({ success: true, message: "User deleted", statusCode: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete";
    res.status(500).json({ success: false, error: message, statusCode: 500 });
  }
});

export default router;
