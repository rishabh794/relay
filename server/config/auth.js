import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

export async function createAuth() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI is required");

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("relay");

  console.log("✅ Better Auth initialized");

  process.on("SIGINT", async () => {
    await client.close();
    process.exit(0);
  });

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
        // Make sure this matches your backend
        redirectURI: `${
          process.env.BASE_URL || "http://localhost:5000"
        }/api/auth/callback/google`,
      },
    },

    // CRITICAL: This should be your FRONTEND URL
    // This is where Better Auth redirects after OAuth
    baseURL: process.env.CLIENT_URL || "http://localhost:5173",

    trustedOrigins: [
      process.env.CLIENT_URL || "http://localhost:5173",
      process.env.BASE_URL || "http://localhost:5000",
    ],

    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
    },

    user: {
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

export default createAuth;
