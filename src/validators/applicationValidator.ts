import z from "zod";

export const createApplicationSchema = z.object({
  jobType: z.string().trim().min(1, "Job type is required"),
  company: z.string().trim().min(1, "Company is required"),
  location: z.string().trim().min(1, "Location is required"),
  position: z.string().trim().min(1, "Position is required"),
  description: z.string(),
});

export const updateApplicationSchema = z.object({
  jobType: z.string().trim().min(1, "Job type is required"),
  company: z.string().trim().min(1, "Company is required"),
  position: z.string().trim().min(1, "Position is required"),
  description: z.string(),
});

export const adminUpdateApplicationSchema = z.object({
  location: z.string().trim().min(1, "Location is required"),
  status: z.string().trim().min(1, "Status is required"),
});
