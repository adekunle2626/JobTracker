import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const mongoURI = process.env["MONGO_URI"];

    if (!mongoURI) {
      throw new Error("mongoURI is not defined");
    }

    await mongoose.connect(mongoURI);
    console.log("MongoDb connected successfully");
  } catch (error) {
    console.error("MongoDb connection failed:", error)
    process.exit(1)
  }
};

export default connectDb