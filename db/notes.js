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

const editNote = async (id, fields = {}) => {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString.length === 0) {
    return;
  }
  try {
    console.log("Editing note");
    const {
      rows: [note],
    } = await client.query(
      `
                UPDATE notes
                SET ${setString}
                WHERE id=${id}
                RETURNING *;
            `,
      Object.values(fields)
    );
    console.log("Finished editing note", note);
    return note;
  } catch (error) {
    console.error("Error editing note");
    throw error;
  }
};

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
                array_agg(row_to_json(items.*))as items
                
                FROM 
                notes
                LEFT OUTER JOIN items ON notes.id = items.notes_Id
                LEFT OUTER JOIN labels ON notes.id = labels.notes_Id
                WHERE notes.users_Id =$1
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

const getNotesByLabel = async (name) => {
  try {
    console.log("Getting notes by label", name);
    const { rows } = await client.query(
      `
                SELECT notes.*, 
                array_agg(row_to_json(items.*))as items
                
                FROM 
                notes
                LEFT OUTER JOIN items ON notes.id = items.notes_Id
                LEFT OUTER JOIN labels ON notes.id = labels.notes_Id
                WHERE labels.label_name =$1
                GROUP BY notes.id;
                
            `,
      [name]
    );
    console.log(
      "Finished getting notes by label",
      JSON.stringify(rows, null, 2)
    );
    return rows;
  } catch (error) {
    console.error("Error getting notes by label");
    throw error;
  }
};

module.exports = {
  createNote,
  editNote,
  getNotesByUser,
  getNotesByLabel,
  getAllNotes,
};
