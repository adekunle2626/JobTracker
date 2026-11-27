import mongoose from "mongoose";
import { env } from "./env";

const connectDb = async () => {
  try {
    await mongoose.connect(env.mongoURI);
    console.log("MongoDb connected successfully");
  } catch (error) {
    console.error("MongoDb connection failed:", error);
    process.exit(1);
  }
};

export default connectDb;
