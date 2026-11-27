import { Request, Response } from "express";
import Application from "../models/Application";
import mongoose from "mongoose";

// create an application
export const createApplication = async (req: Request, res: Response) => {
  const { jobType, company, location, position, description } = req.body as {
    jobType: string;
    company: string;
    location: string;
    position: string;
    description: string;
  };

  if (typeof company !== "string" || !company.trim()) {
    return res.status(400).json({
      message: "Company name must be a non-empty string",
    });
  }

  if (typeof position !== "string" || !position.trim()) {
    return res.status(400).json({
      message: "Position must be a non-empty string",
    });
  }

  const user = req.user!;

  const application = await Application.create({
    jobType,
    company,
    location,
    position,
    description,
    user: user._id,
  });

  return res.status(201).json({
    application,
    user: { name: user.name, email: user.email },
  });
};

// get all applications. an admin can get all the applications
export const getApplications = async (req: Request, res: Response) => {
  const user = req.user!;
  const filter = user.role === "admin" ? {} : { user: user._id };

  const applications = await Application.find(filter).populate(
    "user",
    "name email",
  );

  return res.json({ applications, count: applications.length });
};

// get an application. an admin can get anybody's application
export const getApplication = async (req: Request, res: Response) => {
  const user = req.user!;
  const applicationId = req.params.id;

  if (
    typeof applicationId !== "string" ||
    !mongoose.Types.ObjectId.isValid(applicationId)
  ) {
    return res.status(400).json({ message: "Invalid object ID" });
  }

  const filter =
    user.role === "admin"
      ? { _id: applicationId }
      : { _id: applicationId, user: user._id };

  const application = await Application.findOne(filter).populate(
    "user",
    "name email",
  );

  if (!application) {
    return res.status(404).json({ message: "Application not found" });
  }

  return res.json({
    application,
    user: { name: user.name, email: user.email },
  });
};

// update an application
export const updateApplication = async (req: Request, res: Response) => {
  const user = req.user!;
  const applicationId = req.params.id;

  if (
    typeof applicationId !== "string" ||
    !mongoose.Types.ObjectId.isValid(applicationId)
  ) {
    return res.status(400).json({ message: "Invalid object ID" });
  }

  // 1. Find the application based on the user's role
  const filter =
    user.role === "admin"
      ? { _id: applicationId }
      : { _id: applicationId, user: user._id };

  const application = await Application.findOne(filter).populate(
    "user",
    "name email",
  );

  if (!application) {
    return res.status(404).json({ message: "Application not found" });
  }

  // 2. Define which fields each role can update
  const allowedFields =
    user.role === "admin"
      ? ["location", "status"]
      : ["jobType", "company", "position", "description"];

  // these are the fields a user want to update
  const requestedFields = Object.keys(req.body);

  if (requestedFields.length === 0) {
    return res.status(400).json({
      message: "No fields provided to update",
    });
  }

  // this filters what field each user is allowed to change
  const unauthorizedFields = requestedFields.filter(
    (field) => !allowedFields.includes(field),
  );

  if (unauthorizedFields.length > 0) {
    return res.status(403).json({
      message: "You are not allowed to update these fields",
      fields: unauthorizedFields,
    });
  }

  // Apply permitted updates
  for (const field of requestedFields) {
    application.set(field, req.body[field]);
  }

  // Save changes
  await application.save();

  return res.status(200).json({ application });
};

// delete application
export const deleteApplication = async (req: Request, res: Response) => {
  const user = req.user!;

  const applicationId = req.params.id;

  if (
    typeof applicationId !== "string" ||
    !mongoose.Types.ObjectId.isValid(applicationId)
  ) {
    return res.status(400).json({ message: "Invalid object ID" });
  }

  const filter =
    user.role === "admin"
      ? { _id: applicationId }
      : { _id: applicationId, user: user._id };

  const application = await Application.findOne(filter);

  // if not found, or not yours
  if (!application) {
    return res.status(404).json({
      success: false,
      message: "Application not found",
    });
  }

  // delete it
  await application.deleteOne();

  // send success
  return res.status(200).json({
    success: true,
    message: "Application deleted successfully",
  });
};
