import express from "express";
import { toNodeHandler } from "better-auth/node";
import {
  addPhoneToSignup,
  handlePhoneLogin,
} from "../middleware/phoneAuthMiddleware.js";

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

  return router;
}

export default createAuthRoutes;
