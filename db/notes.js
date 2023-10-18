const client = require("./client");
const { getItemsByNoteId } = require("./items");
const { getLabelsByNoteId } = require("./labels");

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

// const editNote = async (id, { fields }) => {
//   const setString = Object.keys(fields)
//     .map((key, index) => `"${key}"=$${index + 1}`)
//     .join(", ");

//   if (setString.length === 0) {
//     return;
//   }
//   try {
//     console.log("Editing note");
//     const {
//       rows: [note],
//     } = await client.query(
//       `
//                 UPDATE notes
//                 SET ${setString}
//                 WHERE id=${id}
//                 RETURNING *;
//             `,
//       Object.values(fields)
//     );
//     console.log("Finished editing note", note);
//     return note;
//   } catch (error) {
//     console.error("Error editing note");
//     throw error;
//   }
// };

const getAllNotes = async () => {
  try {
    console.log("Getting all notes");
    const { rows: notes } = await client.query(`
                SELECT * FROM notes;
            `);
    console.log("Finished getting all notes", notes);
    let notesWithItems = await Promise.all(
      notes.map(async (note) => {
        note.items = await getItemsByNoteId(note.id);
        note.labels = await getLabelsByNoteId(note.id);
        return note;
      })
    );

    console.log(
      "Finished getting all notes",
      JSON.stringify(notesWithItems, null, 2)
    );
    return notesWithItems;
  } catch (error) {
    console.error("Error getting all notes");
    throw error;
  }
};

const getNotesByUser = async (id) => {
  try {
    console.log("Getting notes by user", id);
    const { rows } = await client.query(
      `
                SELECT notes.*, 
                array_agg(row_to_json(items.*))as items,
                array_agg(row_to_json(labels.*))as labels
                
                FROM 
                notes
                LEFT OUTER JOIN items ON notes.id = items.notes_Id
                LEFT OUTER JOIN labels ON notes.id = labels.notes_Id
                WHERE notes.users_Id =$1 AND notes.is_archived = false
                GROUP BY notes.id;
            `,
      [id]
    );
    console.log(
      "Finished getting notes by user",
      JSON.stringify(rows, null, 2)
    );
    return rows;
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
                SELECT notes.*,
                array_agg(row_to_json(items.*))as items,
                array_agg(row_to_json(labels.*))as labels

                FROM
                notes
                LEFT OUTER JOIN items ON notes.id = items.notes_Id
                LEFT OUTER JOIN labels ON notes.id = labels.notes_Id
                WHERE notes.id=$1 AND notes.is_archived = false
                GROUP BY notes.id;
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

const getArchivedNotesByUser = async (id) => {
  try {
    console.log("Getting archived notes by user", id);
    const { rows } = await client.query(
      `
                SELECT notes.*, 
                array_agg(row_to_json(items.*))as items
                
                FROM 
                notes
                LEFT OUTER JOIN items ON notes.id = items.notes_Id
                LEFT OUTER JOIN labels ON notes.id = labels.notes_Id
                WHERE notes.users_Id =$1 AND notes.is_archived = true
                GROUP BY notes.id;
            `,
      [id]
    );
    console.log(
      "Finished getting archived notes by user",
      JSON.stringify(rows, null, 2)
    );
    return rows;
  } catch (error) {
    console.error("Error getting archived notes by user");
    throw error;
  }
};

const deleteNote = async (noteId) => {
  try {
    console.log("Deleting note", noteId);
    const {
      rows: [note],
    } = await client.query(
      `
                DELETE FROM notes
                WHERE id=$1
                RETURNING *;
            `,
      [noteId]
    );
    console.log("Finished deleting note", note);
    return note;
  } catch (error) {
    console.error("Error deleting note");
    throw error;
  }
};

const archiveNote = async (noteId) => {
  try {
    console.log("Archiving note", noteId);
    const {
      rows: [note],
    } = await client.query(
      `
                UPDATE notes
                SET is_archived = true
                WHERE id=$1
                RETURNING *;
            `,
      [noteId]
    );
    console.log("Finished archiving note", note);
    return note;
  } catch (error) {
    console.error("Error archiving note");
    throw error;
  }
};

const unarchiveNote = async (noteId) => {
  try {
    console.log("Un-archiving note", noteId);
    const {
      rows: [note],
    } = await client.query(
      `
                UPDATE notes
                SET is_archived = false
                WHERE id=$1
                RETURNING *;
            `,
      [noteId]
    );
    console.log("Finished un-archiving note", note);
    return note;
  } catch (error) {
    console.error("Error un-archiving note");
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
};
