import mongoose, { Schema, Document, model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  role: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    password: { type: String, required: true },
  },
  { timestamps: true },
);

export const User = model<IUser>("User", userSchema);

export default User;
