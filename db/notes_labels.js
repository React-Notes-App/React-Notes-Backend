const client = require("./client");

const createNotesLabels = async ({ labelId, noteId }) => {
  try {
    console.log("Creating notes_labels", labelId, noteId);
    const {
      rows: [notes_labels],
    } = await client.query(
      `
            INSERT INTO notes_labels(labels_Id, notes_Id)
            VALUES($1, $2)
            RETURNING *;
            `,
      [labelId, noteId]
    );
    console.log("Finished creating notes_labels", notes_labels);
    return notes_labels;
  } catch (error) {
    console.error("Error creating notes_labels");
    throw error;
  }
};

const addLabelToNote = async (labelId, noteId) => {
  try {
    console.log("Adding label to note", labelId, noteId);
    const {
      rows: [notes_labels],
    } = await client.query(
      `
                INSERT INTO notes_labels(labels_Id, notes_Id)
                VALUES($1, $2)
                ON CONFLICT ON CONSTRAINT notes_labels_uniq
                DO UPDATE SET id = EXCLUDED.id
                RETURNING *;
                `,
      [labelId, noteId]
    );
    console.log("Finished adding label to note", notes_labels);
    return notes_labels;
  } catch (error) {
    console.error("Error adding label to note");
    throw error;
  }
};

const removeLabelFromNote = async (labelId, noteId) => {
  try {
    console.log("Removing label from note", labelId, noteId);
    const {
      rows: [notes_labels],
    } = await client.query(
      `
            DELETE FROM notes_labels
            WHERE labels_Id=$1 AND notes_Id=$2
            RETURNING *;
            `,
      [labelId, noteId]
    );
    console.log("Finished removing label from note", notes_labels);
    return notes_labels;
  } catch (error) {
    console.error("Error removing label from note");
    throw error;
  }
};

const deleteNotesLabels = async (noteId, labelId) => {
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
    console.log("Finished getting labels by noteId", rows);
    return rows;
  } catch (error) {
    console.error("Error getting labels by noteId");
    throw error;
  }
};

const getNotesLabelsByUser = async (id) => {
  try {
    console.log("Getting notes by label", id);
    const { rows } = await client.query(
      `
                SELECT * FROM notes_labels
                JOIN notes ON notes_labels.notes_Id = notes.id
                JOIN labels ON notes_labels.labels_Id = labels.id
                WHERE labels.users_Id=$1;
                `,
      [id]
    );
    console.log("Finished getting notes by label", rows);
    return rows;
  } catch (error) {
    console.error("Error getting notes by label");
    throw error;
  }
};
const getActiveLabelsByUser = async (userId) => {
  try {
    console.log("Getting active labels by user", userId);
    const { rows } = await client.query(
      `
                SELECT 
                distinct on (labels.id)
                labels .*
                FROM notes_labels
                JOIN labels ON notes_labels.labels_Id = labels.id
                JOIN notes ON notes_labels.notes_Id = notes.id
                WHERE notes.users_Id=$1;
            `,
      [userId]
    );
    console.log("Finished getting active labels by user", rows);
    return rows;
  } catch (error) {
    console.error("Error getting active labels by user");
    throw error;
  }
};

module.exports = {
  getNotesLabelsByUser,
  getLabelsByNoteId,
  getActiveLabelsByUser,
  createNotesLabels,
  deleteNotesLabels,
  addLabelToNote,
  removeLabelFromNote,
};
