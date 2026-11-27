import Application from "../models/Application";
import mongoose from "mongoose";
import { Request, Response } from "express";


export const dashboardStatistics = async (req: Request, res: Response) => {
  const user = req.user!;

  const filter = user.role === "admin" ? {} : { user: user._id };

  const statistics = await Application.aggregate([
    {
      $match: filter,
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  // Convert aggregation results into a dashboard-friendly object
  const counts = {
    applied: 0,
    assessment: 0,
    offered: 0,
    rejected: 0,
  };

  statistics.forEach((item) => {
    counts[item._id as keyof typeof counts] = item.count;
  });

  const total =
    counts.applied + counts.assessment + counts.offered + counts.rejected;

  return res.status(200).json({
    total,
    ...counts,
  });
};
