const client = require("./client");
const { getItemsByNoteId } = require("./items");
const { getLabelsByNoteId } = require("./notes_labels");

const createNote = async ({ userId, title, color }) => {
  try {
    const {
      rows: [note],
    } = await client.query(
      `
            INSERT INTO notes( users_Id, title, color)
            VALUES($1, $2, $3)
            RETURNING *;
        `,
      [userId, title, color]
    );
    console.log("Finished creating note", note);
    return note;
  } catch (error) {
    console.error("Error creating note");
    throw error;
  }
};

const editNoteTitle = async ({ id, title }) => {
  try {
    console.log("Editing note title:", id, title);
    const {
      rows: [note],
    } = await client.query(
      `
                UPDATE notes
                SET title=$2
                WHERE id=$1
                RETURNING *;
            `,
      [id, title]
    );
    console.log("Finished editing note title", note);
    return note;
  } catch (error) {
    console.error("Error editing note title");
    throw error;
  }
};

const editNoteColor = async ({ id, color }) => {
  try {
    console.log("Editing note color:", id, color);
    const {
      rows: [note],
    } = await client.query(
      `
                UPDATE notes
                SET color=$2
                WHERE id=$1
                RETURNING *;
            `,
      [id, color]
    );
    console.log("Finished editing note color", note);
    return note;
  } catch (error) {
    console.error("Error editing note color");
    throw error;
  }
};

const getAllNotes = async () => {
  try {
    console.log("Getting all notes");
    const { rows: notes } = await client.query(`
                SELECT * FROM notes;
            `);

    let notesWithItemsAndLabels = await Promise.all(
      notes.map(async (note) => {
        note.items = await getItemsByNoteId(note.id);
        note.labels = await getLabelsByNoteId(note.id);
        return note;
      })
    );

    console.log("Finished getting all notes", JSON.stringify(notes, null, 2));
    return notesWithItemsAndLabels;
  } catch (error) {
    console.error("Error getting all notes");
    throw error;
  }
};

const getNotesByUser = async (userId) => {
  try {
    console.log("Getting notes by user", userId);
    const { rows } = await client.query(
      `
                SELECT notes.*
                FROM notes
                WHERE notes.users_Id =$1;
            `,
      [userId]
    );

    let notesWithItemsAndLabels = await Promise.all(
      rows.map(async (note) => {
        let noteId = note.id;
        note.items = await getItemsByNoteId(noteId);
        note.labels = await getLabelsByNoteId(noteId);
        return note;
      })
    );

    console.log(
      "Finished getting notes by user",
      JSON.stringify(rows, null, 2)
    );
    return notesWithItemsAndLabels;
  } catch (error) {
    console.error("Error getting notes by user");
    throw error;
  }
};

const getNoteById = async (id) => {
  try {
    console.log("Getting note by id", id);
    const {
      rows: [note],
    } = await client.query(
      `
                SELECT notes.*
                FROM notes
               
                WHERE notes.id=$1 AND notes.is_archived = false
               
            `,
      [id]
    );

    console.log("Finished getting note by id", note);
    return note;
  } catch (error) {
    console.error("Error getting note by id");
    throw error;
  }
};

const getArchivedNotesByUser = async (userId) => {
  try {
    console.log("Getting archived notes by user", userId);
    const { rows } = await client.query(
      `
                SELECT notes.*
                FROM notes
                WHERE notes.users_Id =$1 AND notes.is_archived = true;
            `,
      [userId]
    );

    let notesWithItemsAndLabels = await Promise.all(
      rows.map(async (note) => {
        note.items = await getItemsByNoteId(note.id);
        note.labels = await getLabelsByNoteId(note.id);
        return note;
      })
    );
    console.log(
      "Finished getting archived notes by user",
      JSON.stringify(rows, null, 2)
    );
    return notesWithItemsAndLabels;
  } catch (error) {
    console.error("Error getting archived notes by user");
    throw error;
  }
};

const deleteNote = async (id) => {
  try {
    console.log("Deleting note", id);
    const {
      rows: [note],
    } = await client.query(
      `
                DELETE FROM notes
                WHERE id=$1
                RETURNING *;
            `,
      [id]
    );
    console.log("Finished deleting note", note);
    return note;
  } catch (error) {
    console.error("Error deleting note");
    throw error;
  }
};

const archiveNote = async (id) => {
  try {
    console.log("Archiving note", id);
    const {
      rows: [note],
    } = await client.query(
      `
                UPDATE notes
                SET is_archived = true
                WHERE id=$1
                RETURNING *;
            `,
      [id]
    );
    console.log("Finished archiving note", note);
    return note;
  } catch (error) {
    console.error("Error archiving note");
    throw error;
  }
};

const unarchiveNote = async (id) => {
  try {
    console.log("Un-archiving note", id);
    const {
      rows: [note],
    } = await client.query(
      `
                UPDATE notes
                SET is_archived = false
                WHERE id=$1
                RETURNING *;
            `,
      [id]
    );
    console.log("Finished un-archiving note", note);
    return note;
  } catch (error) {
    console.error("Error un-archiving note");
    throw error;
  }
};

const hideNoteCheckboxes = async (id) => {
  try {
    console.log("Hiding note checkboxes:", id);
    const {
      rows: [note],
    } = await client.query(
      `
            UPDATE notes
            SET has_checklist = false
            WHERE id=$1
            RETURNING *;
        `,
      [id]
    );
    console.log("Finished hiding note checkboxes", note);
    return note;
  } catch (error) {
    console.error("Error hiding note checkboxes");
    throw error;
  }
};

const showNoteCheckboxes = async (id) => {
  try {
    console.log("Showing note checkboxes:", id);
    const {
      rows: [note],
    } = await client.query(
      `
            UPDATE notes
            SET has_checklist = true
            WHERE id=$1
            RETURNING *;
        `,
      [id]
    );
    console.log("Finished showing note checkboxes", note);
    return note;
  } catch (error) {
    console.error("Error showing note checkboxes");
    throw error;
  }
};

module.exports = {
  createNote,
  editNoteTitle,
  editNoteColor,
  getNotesByUser,
  getNoteById,
  getArchivedNotesByUser,
  getAllNotes,
  deleteNote,
  archiveNote,
  unarchiveNote,
  hideNoteCheckboxes,
  showNoteCheckboxes,
};
