import Group from "../models/Group.js";
import asyncHandler from "express-async-handler";

export const createGroup = asyncHandler(async (req, res) => {
  const { name, color } = req.body;

  const escapedName = name.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");

  const existingGroup = await Group.findOne({
    name: { $regex: new RegExp(`^${escapedName}$`, "i") },
  }).exec();

  if (existingGroup) {
    return res.status(400).json({ error: "Group already exists" });
  }

  const newGroup = new Group({ name, color });
  const savedGroup = await newGroup.save();

  req.io.emit("groupCreated", savedGroup);

  res.status(201).json(savedGroup);
});

export const getGroups = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const groups = await Group.find().skip(skip).limit(limit).exec();
    const totalGroups = await Group.countDocuments().exec();

    res.status(200).json({
      data: groups,
      totalPages: Math.ceil(totalGroups / limit),
      currentPage: page,
      totalItems: totalGroups,
    });
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export const searchGroups = asyncHandler(async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {
      name: { $regex: query, $options: "i" },
    };

    const groups = await Group.find(filter).skip(skip).limit(limit).exec();
    const totalGroups = await Group.countDocuments(filter).exec();

    res.status(200).json({
      data: groups,
      totalPages: Math.ceil(totalGroups / limit),
      currentPage: page,
      totalItems: totalGroups,
    });
  } catch (error) {
    console.error("Error searching groups:", error);
    res.status(500).json({ message: "Server error" });
  }
});
