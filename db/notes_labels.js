const client = require("./client");

const createNotesLabels = async ({ noteId, labelId }) => {
  try {
    console.log("Creating notes_labels", noteId, labelId);
    const {
      rows: [notes_labels],
    } = await client.query(
      `
                INSERT INTO notes_labels(notes_Id, labels_Id)
                VALUES($1, $2)
                RETURNING *;
            `,
      [noteId, labelId]
    );
    console.log("Finished creating notes_labels", notes_labels);
    return notes_labels;
  } catch (error) {
    console.error("Error creating notes_labels");
    throw error;
  }
};

const deleteNotesLabels = async ({ noteId, labelId }) => {
  try {
    console.log("Deleting notes_labels", noteId, labelId);
    const {
      rows: [notes_labels],
    } = await client.query(
      `
                    DELETE FROM notes_labels
                    WHERE notes_Id=$1 AND labels_Id=$2
                    RETURNING *;
                `,
      [noteId, labelId]
    );
    console.log("Finished deleting notes_labels", notes_labels);
    return notes_labels;
  } catch (error) {
    console.error("Error deleting notes_labels");
    throw error;
  }
};

const getNotesByLabel = async (labelId) => {
  try {
    console.log("Getting notes by label", labelId);
    const { rows } = await client.query(
      `
                SELECT *
                FROM notes_labels
                JOIN notes ON notes_labels.notes_Id = notes.id
                WHERE notes_labels.labels_Id=$1;
            `,
      [labelId]
    );
    console.log("Finished getting notes by label", rows);
    return rows;
  } catch (error) {
    console.error("Error getting notes by label");
    throw error;
  }
};

const getLabelsByNoteId = async (noteId) => {
  try {
    console.log("Getting labels by note", noteId);
    const { rows } = await client.query(
      `
                SELECT *
                FROM notes_labels
                JOIN labels ON notes_labels.labels_Id = labels.id
                WHERE notes_labels.notes_Id=$1;
            `,
      [noteId]
    );
    console.log("Finished getting labels by note", rows);
    return rows;
  } catch (error) {
    console.error("Error getting labels by note");
    throw error;
  }
};

module.exports = {
  getNotesByLabel,
  getLabelsByNoteId,
  createNotesLabels,
  deleteNotesLabels,
};
