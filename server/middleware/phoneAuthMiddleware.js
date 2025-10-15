import { MongoClient } from "mongodb";

let db = null;

async function getDB() {
  if (db) return db;

  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri);
  await client.connect();
  db = client.db("relay");
  return db;
}

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

    const database = await getDB();
    const existingUser = await database.collection("user").findOne({
      phoneNumber: normalizedPhone,
    });

    if (existingUser) {
      return res.status(400).json({
        error: "Phone number already registered",
      });
    }
    req.normalizedPhone = normalizedPhone;
    next();
  } catch (error) {
    console.error("Phone validation error:", error);
    return res.status(500).json({ error: "Failed to validate phone number" });
  }
}

export async function handlePhoneLogin(req, res, next) {
  try {
    const { email, password } = req.body;
    const isPhone = /^\+?\d{10,15}$/.test(email?.replace(/\D/g, ""));

    if (!isPhone) {
      return next();
    }

    const cleanedPhone = email.replace(/\D/g, "");
    const normalizedPhone = `+${cleanedPhone}`;

    const database = await getDB();
    const user = await database.collection("user").findOne({
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
