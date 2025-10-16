import express from "express";
import { toNodeHandler } from "better-auth/node";
import {
  addPhoneToSignup,
  handlePhoneLogin,
} from "../middleware/phoneAuthMiddleware.js";
import User from "../models/userModel.js";
import Message from "../models/messageModel.js";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

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
      })
        .sort({ createdAt: "asc" })
        .populate("sender", "name");

      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to get messages" });
    }
  });

  router.post("/upload", upload.single("file"), async (req, res) => {
    try {
      const session = await auth.api.getSession({ headers: req.headers });
      if (!session?.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded." });
      }

      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const result = await cloudinary.uploader.upload(dataURI, {
        resource_type: "auto",
      });

      res.status(200).json({ url: result.secure_url });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "File upload failed" });
    }
  });

  router.patch("/users/update", async (req, res) => {
    try {
      const session = await auth.api.getSession({ headers: req.headers });
      if (!session?.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { name, email, image, phoneNumber } = req.body;
      const updateData = {};

      if (phoneNumber) {
        const cleanedPhone = phoneNumber.replace(/\D/g, "");

        if (cleanedPhone.length < 10 || cleanedPhone.length > 15) {
          return res.status(400).json({
            message: "Invalid phone number format. Must be 10-15 digits.",
          });
        }

        const normalizedPhone = `+${cleanedPhone}`;

        const existingPhone = await User.findOne({
          phoneNumber: normalizedPhone,
          _id: { $ne: session.user.id },
        });

        if (existingPhone) {
          return res.status(400).json({
            message: "Phone number already in use",
          });
        }

        updateData.phoneNumber = normalizedPhone;
      }

      if (email && email !== session.user.email) {
        const existingEmail = await User.findOne({
          email: email.toLowerCase(),
          _id: { $ne: session.user.id },
        });

        if (existingEmail) {
          return res.status(400).json({
            message: "Email already in use",
          });
        }

        updateData.email = email.toLowerCase();
      }

      if (name) updateData.name = name;
      if (image) updateData.image = image;

      const updatedUser = await User.findByIdAndUpdate(
        session.user.id,
        updateData,
        { new: true, runValidators: true }
      ).select("name email image phoneNumber");

      if (name || image) {
        await auth.api.updateUser({
          body: { name, image },
          headers: req.headers,
        });
      }

      res.json({
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  router.delete("/users/delete", async (req, res) => {
    try {
      const session = await auth.api.getSession({ headers: req.headers });
      if (!session?.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const userId = session.user.id;

      await Message.deleteMany({
        $or: [{ sender: userId }, { receiver: userId }],
      });

      await auth.api.deleteUser({
        headers: req.headers,
        body: { userId: userId },
      });

      await User.findByIdAndDelete(userId);

      res.json({ message: "Account deleted successfully" });
    } catch (error) {
      console.error("Delete error:", error);
      res.status(500).json({ message: "Failed to delete account" });
    }
  });

  return router;
}

export default createAuthRoutes;
