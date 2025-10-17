import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { createServer } from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import { createAuth } from "./config/auth.js";
import { createAuthRoutes } from "./routes/authRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { initializeSocket } from "./socket/socket.js";

await connectDB();
const app = express();
const httpServer = createServer(app);
const auth = createAuth();

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});
initializeSocket(io, auth);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => res.json({ message: "API is running!" }));
app.use("/api", createAuthRoutes(auth));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 10000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 Accepting requests from: ${process.env.CLIENT_URL}`);
});
