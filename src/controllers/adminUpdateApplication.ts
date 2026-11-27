import { Request, Response } from "express";
import Application from "../models/Application";
import mongoose from "mongoose";

export const adminUpdateApplication = async (req: Request, res: Response) => {
  const applicationId = req.params.id;

  if (
    typeof applicationId !== "string" ||
    !mongoose.Types.ObjectId.isValid(applicationId)
  ) {
    return res.status(400).json({ message: "Invalid object ID" });
  }

  const application = await Application.findById(applicationId);

  if (!application) {
    return res.status(404).json({ message: "Application not found" });
  }

  const allowedFields = ["location", "status"];

  const requestedFields = Object.keys(req.body ?? {});

  if (requestedFields.length === 0) {
    return res.status(400).json({ message: "No fields provided to update" });
  }

  const unauthorizedFields = requestedFields.filter(
    (field) => !allowedFields.includes(field),
  );

  if (unauthorizedFields.length > 0) {
    return res.status(403).json({
      message: "You are not allowed to update these fields",
      fields: unauthorizedFields,
    });
  }

  for (const field of requestedFields) {
    application.set(field, req.body[field]);
  }

  await application.save();

  return res.status(200).json({ application });
};
