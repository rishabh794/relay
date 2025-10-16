import { getDB } from "../config/db.js";

/**
 * Middleware to validate and normalize phone number during signup
 * Better Auth will handle the actual storage
 */
export async function addPhoneToSignup(req, res, next) {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        error: "Phone number is required for signup",
      });
    }

    const cleanedPhone = phoneNumber.replace(/\D/g, "");

    if (cleanedPhone.length < 10 || cleanedPhone.length > 15) {
      return res.status(400).json({
        error: "Invalid phone number format. Must be 10-15 digits.",
      });
    }

    const normalizedPhone = `+${cleanedPhone}`;

    const db = getDB();
    const existingUser = await db.collection("user").findOne({
      phoneNumber: normalizedPhone,
    });

    if (existingUser) {
      return res.status(400).json({
        error: "Phone number already registered",
      });
    }

    req.body.phoneNumber = normalizedPhone;
    next();
  } catch (error) {
    console.error("Phone validation error:", error);
    return res.status(500).json({ error: "Failed to validate phone number" });
  }
}

export async function handlePhoneLogin(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email/Phone and password are required",
      });
    }

    const cleanedInput = email.replace(/\D/g, "");
    const isPhone = /^\+?\d{10,15}$/.test(cleanedInput);

    if (!isPhone) {
      return next();
    }

    const normalizedPhone = `+${cleanedInput}`;

    const db = getDB();
    const user = await db.collection("user").findOne({
      phoneNumber: normalizedPhone,
    });

    if (!user) {
      return res.status(400).json({
        error: "Invalid credentials",
      });
    }

    req.body.email = user.email;
    next();
  } catch (error) {
    console.error("Phone login error:", error);
    return res.status(500).json({ error: "Failed to process login" });
  }
}

export function validatePhoneNumber(phoneNumber) {
  if (!phoneNumber) {
    return { valid: false, error: "Phone number is required" };
  }

  const cleanedPhone = phoneNumber.replace(/\D/g, "");

  if (cleanedPhone.length < 10 || cleanedPhone.length > 15) {
    return {
      valid: false,
      error: "Invalid phone number format. Must be 10-15 digits.",
    };
  }

  return {
    valid: true,
    normalized: `+${cleanedPhone}`,
  };
}
