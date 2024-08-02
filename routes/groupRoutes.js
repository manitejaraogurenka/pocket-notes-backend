import express from "express";
import {
  createGroup,
  getGroups,
  searchGroups,
} from "../controllers/groupController.js";

const router = express.Router();

router.post("/groups", createGroup);
router.get("/groups", getGroups);
router.get("/groups/search", searchGroups);

export default router;
