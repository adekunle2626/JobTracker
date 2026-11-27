import mongoose, { Schema, Document, model, Types } from "mongoose";
export interface IApplication extends Document {
  jobType: string;
  company: string;
  location: string;
  position: string;
  description: string;
  status: string;
  user: Types.ObjectId;
  applicationDate: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    jobType: { type: String, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    position: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["applied", "assessment", "offered", "rejected"],
      default: "applied",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    applicationDate: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const Application = model<IApplication>(
  "Application",
  applicationSchema,
);

export default Application;
