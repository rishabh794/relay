import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getDB, getMongoClient } from "./db.js";

export function createAuth() {
  const db = getDB();
  const client = getMongoClient();

  console.log("✅ Better Auth initialized with shared Mongoose connection");

  return betterAuth({
    database: mongodbAdapter(db, { client }),

    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },

    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        redirectURI: `${process.env.BASE_URL}/api/auth/callback/google`,
        prompt: "consent",
      },
    },

    baseURL: process.env.BASE_URL || "http://localhost:5000",

    trustedOrigins: [
      process.env.CLIENT_URL || "http://localhost:5173",
      process.env.BASE_URL || "http://localhost:5000",
    ],

    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5,
      },
    },

    cookie: {
      secure: true,
      sameSite: "none",
      httpOnly: true,
      path: "/",
    },

    user: {
      deleteUser: {
        enabled: true,
      },
      additionalFields: {
        phoneNumber: {
          type: "string",
          required: true,
          unique: true,
        },
      },
    },
  });
}
