const express = require("express");
const notesRouter = express.Router();

const { requireUser } = require("./utils");
const {
  getAllNotes,
  getNotesByUser,
  getNotesByLabel,
  getNoteById,
  createNote,
  editNote,
  destroyNote,
} = require("../db");

//GET all notes
notesRouter.get("/all_notes", async (req, res, next) => {
  try {
    const notes = await getAllNotes();
    if (!notes) {
      next({
        name: "NoNotesError",
        message: "There are no notes in the database",
      });
    } else {
      res.send({ notes: notes, success: true });
    }
  } catch (error) {
    next(error);
  }
});

//GET notes by user
//"api/notes/user"

notesRouter.get("/user", requireUser, async (req, res, next) => {
  try {
    const id = req.user.id;
    const notes = await getNotesByUser(id);
    if (!notes) {
      next({
        name: "NoNotesError",
        message: "There are no notes in the database",
      });
    } else {
      res.send({ notes: notes, success: true });
    }
  } catch (error) {
    next(error);
  }
});

//GET notes by label
notesRouter.get("/labels/label_name", requireUser, async (req, res, next) => {
  try {
    const name = req.body.name;
    const notes = await getNotesByLabel(name);
    if (!notes) {
      next({
        name: "NoNotesError",
        message: "There are no notes in the database",
      });
    } else {
      res.send({ notes: notes, success: true });
    }
  } catch (error) {
    next(error);
  }
});

//POST create note

notesRouter.post("/", requireUser, async (req, res, next) => {
  const { title, color } = req.body;
  const { id } = req.user;
  const noteData = {};

  if (title) {
    noteData.title = title;
  }
  if (color) {
    noteData.color = color;
  }

  try {
    const newNote = await createNote({
      ...noteData,
      userId: id,
    });
    res.send({ note: newNote, success: true });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

//UPDATE note
//api/notes/:id
notesRouter.patch("/user/:id", requireUser, async (req, res, next) => {
  const { id } = req.params;
  const { title, color } = req.body;
  const updateFields = {};

  if (title) {
    updateFields.title = title;
  }
  if (color) {
    updateFields.color = color;
  }

  try {
    const updatedNote = await editNote(id, updateFields);
    res.send({ note: updatedNote, success: true });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

//Create item for note

notesRouter.post("/:id/items", requireUser, async (req, res, next) => {
  const { id } = req.params;
  const { name, quantity, noteId } = req.body;
  const itemData = {};

  if (name) {
    itemData.name = name;
  }
  if (quantity) {
    itemData.quantity = quantity;
  }

  try {
    const newItem = await createItem({
      ...itemData,
      noteId: id,
    });
    res.send({ item: newItem, success: true });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = notesRouter;
