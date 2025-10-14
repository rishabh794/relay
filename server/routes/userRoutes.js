import express from "express";
const router = express.Router();
import { registerUser, loginUser } from "../controllers/userController.js";

router.post("/", registerUser);
router.post("/login", loginUser);

export default router;
