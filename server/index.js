import express from "express";
import "dotenv/config";
import connectDB from "./config/db.js";

connectDB();
const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("API is running successfully!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
