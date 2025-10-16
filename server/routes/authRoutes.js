import express from "express";
import { toNodeHandler } from "better-auth/node";
import {
  addPhoneToSignup,
  handlePhoneLogin,
} from "../middleware/phoneAuthMiddleware.js";
import User from "../models/userModel.js";
import Message from "../models/messageModel.js";

export function createAuthRoutes(auth) {
  const router = express.Router();

  router.post("/auth/sign-up/email", addPhoneToSignup, toNodeHandler(auth));

  router.post("/auth/sign-in/email", handlePhoneLogin, toNodeHandler(auth));

  router.use("/auth", toNodeHandler(auth));

  router.get("/me", async (req, res) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers,
      });

      if (!session) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      res.json({
        user: session.user,
        session: {
          expiresAt: session.expiresAt,
        },
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to get user session" });
    }
  });

  router.post("/logout", async (req, res) => {
    try {
      await auth.api.signOut({
        headers: req.headers,
      });

      res.json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ message: "Failed to logout" });
    }
  });

  router.get("/users", async (req, res) => {
    try {
      const session = await auth.api.getSession({ headers: req.headers });
      if (!session?.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const users = await User.find({ _id: { $ne: session.user.id } }).select(
        "name email image"
      );
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to get users" });
    }
  });

  router.get("/messages/:otherUserId", async (req, res) => {
    try {
      const session = await auth.api.getSession({ headers: req.headers });
      if (!session?.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const currentUserId = session.user.id;
      const otherUserId = req.params.otherUserId;

      const messages = await Message.find({
        $or: [
          { sender: currentUserId, receiver: otherUserId },
          { sender: otherUserId, receiver: currentUserId },
        ],
      }).sort({ createdAt: "asc" });

      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to get messages" });
    }
  });

  return router;
}

export default createAuthRoutes;
