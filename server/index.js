import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB, { closeDB } from "./config/db.js";
import { createAuth } from "./config/auth.js";
import { createAuthRoutes } from "./routes/authRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.json({
    message: "API is running!",
    timestamp: new Date(),
    database: "relay",
    environment: process.env.NODE_ENV || "development",
  });
});

async function startServer() {
  try {
    await connectDB();
    const auth = createAuth();

    app.use("/api", createAuthRoutes(auth));

    app.use(notFound);
    app.use(errorHandler);

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🌐 Client URL: ${process.env.CLIENT_URL}`);
    });

    const gracefulShutdown = async (signal) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);

      server.close(async () => {
        console.log("🔒 HTTP server closed");
        await closeDB();
        console.log("✅ Graceful shutdown complete");
        process.exit(0);
      });

      setTimeout(() => {
        console.error("⚠️ Forcing shutdown after timeout");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

    process.on("unhandledRejection", (err) => {
      console.error("❌ Unhandled Promise Rejection:", err);
      gracefulShutdown("unhandledRejection");
    });

    process.on("uncaughtException", (err) => {
      console.error("❌ Uncaught Exception:", err);
      gracefulShutdown("uncaughtException");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
