import mongoose from "mongoose";
import { MongoClient } from "mongodb";

let mongoClient = null;
let db = null;

const connectDB = async () => {
  try {
    const mongooseConn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "relay",
    });

    console.log(`✅ Mongoose Connected: ${mongooseConn.connection.host}`);
    console.log(`📁 Database: ${mongooseConn.connection.name}`);

    mongoClient = new MongoClient(process.env.MONGO_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
    });

    await mongoClient.connect();
    db = mongoClient.db("relay");

    console.log(`✅ MongoDB Native Client Connected for Better Auth`);

    return { mongooseConnection: mongooseConn, mongoClient, db };
  } catch (error) {
    console.error(`❌ Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export function getDB() {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB first.");
  }
  return db;
}

export function getMongoClient() {
  if (!mongoClient) {
    throw new Error("MongoDB client not initialized. Call connectDB first.");
  }
  return mongoClient;
}

export async function closeDB() {
  try {
    if (mongoClient) {
      await mongoClient.close();
      console.log("🔌 MongoDB native client closed");
    }

    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log("🔌 Mongoose connection closed");
    }
  } catch (error) {
    console.error("Error closing database connections:", error);
  }
}

export default connectDB;
