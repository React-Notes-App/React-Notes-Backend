const express = require("express");
const notesRouter = express.Router();

const { requireUser, requireAdmin } = require("./utils");
const {
  //Notes//
  getAllNotes,
  getNotesByUser,
  getArchivedNotesByUser,
  createNote,
  editNote,
  deleteNote,
  archiveNote,

  //Items//
  getAllItems,
  createItem,
  updateItem,
  deleteItem,

  //Labels//
  getAllLabels,
  getLabelsByUser,
  createLabel,
  addLabelToNote,
  removeLabelFromNote,
  editLabel,
  deleteLabel,
} = require("../db");

//GET All Notes  ***needs Admin***
//GET /api/notes/all_notes

notesRouter.get("/all_notes", requireAdmin, async (req, res, next) => {
  try {
    const notes = await getAllNotes();
    if (!notes) {
      next({
        name,
        complete: "NoNotesError",
        message: "There are no notes in the database",
      });
    } else {
      res.send({ notes: notes, success: true });
    }
  } catch (error) {
    next(error);
  }
});

//GET Notes By User
//GET "/api/notes/user"

notesRouter.get("/user", requireUser, async (req, res, next) => {
  try {
    const id = req.user.id;
    const notes = await getNotesByUser(id);
    if (!notes) {
      next({
        name,
        complete: "NoNotesError",
        message: "There are no notes in the database",
      });
    } else {
      res.send({ notes: notes, success: true });
    }
  } catch (error) {
    next(error);
  }
});

//GET Archived Notes By User
//GET "/api/notes/user/archived"

notesRouter.get("/user/archived", requireUser, async (req, res, next) => {
  try {
    const id = req.user.id;
    const notes = await getArchivedNotesByUser(id);
    if (notes.length === 0 || !notes) {
      next({
        name,
        complete: "NoNotesError",
        message: "There are no archived notes in the database",
      });
    } else {
      res.send({ notes: notes, success: true });
    }
  } catch (error) {
    next(error);
  }
});

//POST Create Note
//POST "/api/notes/user/create_note"

notesRouter.post("/user/create_note", requireUser, async (req, res, next) => {
  try {
    const { title } = req.body;
    const { id } = req.user;
    const newNote = await createNote({
      title,
      userId: id,
    });
    if (!newNote) {
      next({
        name,
        complete: "NoteCreationError",
        message: "Note does not exist",
      });
    } else {
      res.send({ note: newNote, success: true });
    }
  } catch ({ name, complete, message }) {
    next({ name, complete, message });
  }
});

//Edit Note Title
//PATCH "/api/notes/user/:noteId/edit_note"

notesRouter.patch(
  "/user/:noteId/edit_note",
  requireUser,
  async (req, res, next) => {
    try {
      const noteId = req.params.noteId;
      const { title, color } = req.body;
      const editedNote = await editNote(noteId, { title, color });
      if (!editedNote) {
        next({
          name,
          complete: "NoteEditError",
          message: "Note does not exist",
        });
      } else {
        res.send({ note: editedNote, success: true });
      }
    } catch (error) {
      next(error);
    }
  }
);

//DELETE Note
//DELETE "/api/notes/user/:noteId"

notesRouter.delete(
  "/user/:noteId/delete_note",
  requireUser,
  async (req, res, next) => {
    try {
      const noteId = req.params.noteId;
      const deletedNote = await deleteNote(noteId);
      if (!deletedNote) {
        next({
          name,
          complete: "NoteDeleteError",
          message: "Note does not exist",
        });
      } else {
        res.send({ note: deletedNote, success: true });
      }
    } catch (error) {
      next(error);
    }
  }
);

//ARCHIVE Note
//PATCH "/api/notes/user/:noteId/archive"

notesRouter.patch(
  "/user/:noteId/archive_note",
  requireUser,
  async (req, res, next) => {
    try {
      const noteId = req.params.noteId;
      const archivedNote = await archiveNote(noteId);
      if (!archivedNote) {
        next({
          name,
          complete: "NoteArchiveError",
          message: "Note does not exist",
        });
      } else {
        res.send({ note: archivedNote, success: true });
      }
    } catch (error) {
      next(error);
    }
  }
);

//GET All Items ***needs Admin***
//GET "/api/notes/all_items"

notesRouter.get("/all_items", requireAdmin, async (req, res, next) => {
  try {
    const items = await getAllItems();
    if (!items) {
      next({
        name: "NoItemsError",
        message: "There are no items in the database",
      });
    } else {
      res.send({ items: items, success: true });
    }
  } catch (error) {
    next(error);
  }
});

//POST Create Item For Note
//POST "/api/notes/user/:noteId/add_item"

notesRouter.post(
  "/user/:noteId/add_item",
  requireUser,
  async (req, res, next) => {
    try {
      const { noteId } = req.params;
      const { name } = req.body;
      const newItem = await createItem({ noteId, name });
      if (!newItem) {
        next({
          name: "ItemCreationError",
          message: "Item does not exist",
        });
      } else {
        res.send({ newItem: newItem, success: true });
      }
    } catch (error) {
      next(error);
    }
  }
);

//PATCH Edit Item For Note
//PATCH "/api/notes/user/:noteId/items/:itemId"

notesRouter.patch(
  "/user/:noteId/items/edit_item/:itemId",
  requireUser,
  async (req, res, next) => {
    try {
      const itemId = req.params.itemId;
      const { item_name, completed } = req.body;
      const editedItem = await updateItem(itemId, { item_name, completed });

      if (!editedItem) {
        next({
          name: "ItemEditError",
          message: "Item does not exist",
        });
      } else {
        res.send({ newItem: editedItem, success: true });
      }
    } catch (error) {
      next(error);
    }
  }
);

//DELETE Item For Note
//DELETE "/api/notes/user/:noteId/items/:itemId"

notesRouter.delete(
  "/user/:noteId/items/delete_item/:itemId",
  requireUser,
  async (req, res, next) => {
    try {
      const itemId = req.params.itemId;
      const deletedItem = await deleteItem(itemId);

      if (!deletedItem) {
        next({
          name,
          complete: "ItemDeleteError",
          message: "Item does not exist",
        });
      } else {
        res.send({ newItem: deletedItem, success: true });
      }
    } catch (error) {
      next(error);
    }
  }
);

//GET ALL Labels ***needs Admin***
//GET "/api/notes/all_labels"

notesRouter.get("/all_labels", requireAdmin, async (req, res, next) => {
  try {
    const labels = await getAllLabels();
    if (!labels) {
      next({
        name,
        complete: "NoLabelsError",
        message: "There are no labels in the database",
      });
    } else {
      res.send({ labels: labels, success: true });
    }
  } catch (error) {
    next(error);
  }
});

//GET User Labels
//GET "/api/notes/user/labels"

notesRouter.get("/user/labels", requireUser, async (req, res, next) => {
  try {
    const id = req.user.id;
    const labels = await getLabelsByUser(id);
    if (!labels) {
      next({
        name,
        complete: "NoLabelsError",
        message: "There are no labels in the database",
      });
    } else {
      res.send({ labels: labels, success: true });
    }
  } catch (error) {
    next(error);
  }
});

//POST Create Label
//POST "/api/notes/user/create_label"

notesRouter.post(
  "/user/labels/create_label",
  requireUser,
  async (req, res, next) => {
    try {
      const { name } = req.body;
      const newLabel = await createLabel({ name });
      if (!newLabel) {
        next({
          name,
          complete: "LabelCreationError",
          message: "Label does not exist",
        });
      } else {
        res.send({ label: newLabel, success: true });
      }
    } catch ({ name, complete, message }) {
      next({ name, complete, message });
    }
  }
);

//PATCH Add Label To Note
//PATCH "/api/notes/user/:noteId/add_label"

notesRouter.patch(
  "/user/:noteId/add_label",
  requireUser,
  async (req, res, next) => {
    try {
      const noteId = req.params.noteId;
      const { labelId } = req.body;
      const addedLabel = await addLabelToNote(noteId, labelId);
      if (!addedLabel || !labelId) {
        next({
          name: "LabelAddError",
          message: "Label does not exist",
        });
      } else {
        res.send({ label: addedLabel, success: true });
      }
    } catch (error) {
      next(error);
    }
  }
);

//PATCH Remove Label From Note
//PATCH "/api/notes/user/:noteId/remove_label"

notesRouter.patch(
  "/user/:noteId/remove_label",
  requireUser,
  async (req, res, next) => {
    try {
      const noteId = req.params.noteId;
      const { labelId } = req.body;
      const removedLabel = await removeLabelFromNote({
        noteId,
        labelId,
      });
      if (!removedLabel) {
        next({
          name,
          complete: "LabelRemoveError",
          message: "Label does not exist",
        });
      } else {
        res.send({ label: removedLabel, success: true });
      }
    } catch (error) {
      next(error);
    }
  }
);

//Patch Edit Label
//PATCH "/api/notes/user/:labelId/edit_label"

notesRouter.patch(
  "/user/:labelId/edit_label",
  requireUser,
  async (req, res, next) => {
    try {
      const labelId = req.params.labelId;
      const { label_name } = req.body;
      const editedLabel = await editLabel(labelId, { label_name });
      if (!editedLabel || !labelId) {
        next({
          name: "LabelEditError",
          message: "Label does not exist",
        });
      } else {
        res.send({ label: editedLabel, success: true });
      }
    } catch (error) {
      next(error);
    }
  }
);

//DELETE Label
//DELETE "/api/notes/user/:labelId/delete_label"

notesRouter.delete(
  "/user/:labelId/delete_label",
  requireUser,
  async (req, res, next) => {
    try {
      const labelId = req.params.labelId;
      const deletedLabel = await deleteLabel(labelId);
      if (!deletedLabel || !labelId) {
        next({
          name,
          complete: "LabelDeleteError",
          message: "Label does not exist",
        });
      } else {
        res.send({ label: deletedLabel, success: true });
      }
    } catch (error) {
      next(error);
    }
  }
);

module.exports = notesRouter;
