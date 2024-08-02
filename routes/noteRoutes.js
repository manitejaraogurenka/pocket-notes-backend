import express from "express";
import {
  createNote,
  getNotesByGroup,
  searchNotes,
  updateNote,
  deleteNote,
} from "../controllers/noteController.js";

const router = express.Router();

router.post("/notes", createNote);
router.get("/groups/:groupId/notes", getNotesByGroup);
router.get("/notes/search", searchNotes);
router.put("/notes/:noteId", updateNote);
router.delete("/notes/:noteId", deleteNote);

export default router;
