import Note from "../models/Note.js";
import asyncHandler from "express-async-handler";

export const createNote = asyncHandler(async (req, res) => {
  const { groupId, content } = req.body;
  const newNote = new Note({ groupId, content });
  const savedNote = await newNote.save();
  req.io.emit("noteCreated", savedNote);
  res.status(201).json(savedNote);
});

export const getNotesByGroup = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const notes = await Note.find({ groupId });
  res.status(200).json(notes);
});

export const searchNotes = asyncHandler(async (req, res) => {
  const { query } = req.query;
  const notes = await Note.find({ content: new RegExp(query, "i") });
  res.status(200).json(notes);
});

export const updateNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params;
  const { content } = req.body;
  const updatedNote = await Note.findByIdAndUpdate(
    noteId,
    { content },
    { new: true }
  );
  if (!updatedNote) {
    res.status(404).json({ error: "Note not found" });
  } else {
    req.io.emit("noteUpdated", updatedNote);
    res.status(200).json(updatedNote);
  }
});

export const deleteNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params;
  const deletedNote = await Note.findByIdAndDelete(noteId);
  if (!deletedNote) {
    res.status(404).json({ error: "Note not found" });
  } else {
    req.io.emit("noteDeleted", deletedNote);
    res.status(200).json(deletedNote);
  }
});
