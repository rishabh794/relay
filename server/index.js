import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import morgan from "morgan";

await connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.send("API is running successfully!");
});

app.use("/api/users", userRoutes);

const { default: createAuth } = await import("./config/auth.js");
const auth = await createAuth();
const { toNodeHandler } = await import("better-auth/node");
app.use("/api/auth", toNodeHandler(auth));

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
