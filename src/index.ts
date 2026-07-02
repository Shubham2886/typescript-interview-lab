// ============================================================
// Entry Point — Express App with TypeScript
// ============================================================

import express, { Application, Request, Response, NextFunction } from "express";
import userRouter from "./api/user.controller";

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", userRouter);

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "OK",
    message: "TypeScript Interview Lab API is running",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, error: "Route not found", statusCode: 404 });
});

// Global error handler
app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const message = error instanceof Error ? error.message : "Internal server error";
  res.status(500).json({ success: false, error: message, statusCode: 500 });
});

app.listen(PORT, () => {
  console.log(`\n🚀 TypeScript Interview Lab running on http://localhost:${PORT}`);
  console.log(`📋 Health Check: http://localhost:${PORT}/health`);
  console.log(`👥 Users API:    http://localhost:${PORT}/api/users\n`);
});

export default app;
