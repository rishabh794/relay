import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import morgan from "morgan";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import {
  addPhoneToSignup,
  handlePhoneLogin,
} from "./middleware/phoneAuthMiddleware.js";

await connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

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
  res.json({ message: "API is running!", timestamp: new Date() });
});

const { default: createAuth } = await import("./config/auth.js");
const auth = await createAuth();
const { toNodeHandler } = await import("better-auth/node");

app.post(
  "/api/auth/sign-up/email",
  addPhoneToSignup,
  async (req, res, next) => {
    try {
      const handler = toNodeHandler(auth);
      await handler(req, res);

      if (req.normalizedPhone && res.statusCode === 200) {
        const { MongoClient } = await import("mongodb");
        const client = new MongoClient(process.env.MONGO_URI);
        await client.connect();
        const db = client.db("relay");

        await db
          .collection("user")
          .updateOne(
            { email: req.body.email },
            { $set: { phoneNumber: req.normalizedPhone } }
          );

        await client.close();
      }
    } catch (error) {
      next(error);
    }
  }
);

app.post("/api/auth/sign-in/email", handlePhoneLogin, toNodeHandler(auth));

app.use("/api/auth", toNodeHandler(auth));

app.get("/api/me", async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    res.json({ user: session.user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
