export async function createAuth() {
  const { betterAuth } = await import("better-auth");
  const { mongodbAdapter } = await import("better-auth/adapters/mongodb");
  const { MongoClient } = await import("mongodb");

  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI is required for better-auth");
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("relay");
  console.log("ℹ️ Initializing better-auth (Google OAuth only)");

  process.on("exit", () => {
    try {
      client.close();
    } catch (e) {}
  });

  return betterAuth({
    database: mongodbAdapter(db, { client }),

    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        redirectURI: `${
          process.env.BASE_URL || "http://localhost:5000"
        }/api/auth/callback/google`,
      },
    },

    trustedOrigins: [process.env.CLIENT_URL || "http://localhost:3000"],

    callbacks: {
      async onSignIn({ user, account }) {
        const { default: User } = await import("../models/userModel.js");

        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          await User.create({
            email: user.email,
            name: user.name,
            provider: "google",
            providerId: account.providerAccountId,
          });
          console.log(`✅ Created user in custom DB: ${user.email}`);
        }

        return { user };
      },
    },
  });
}

export default createAuth;
