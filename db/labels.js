const client = require("./client");

const createLabel = async ({ name }) => {
  try {
    const {
      rows: [label],
    } = await client.query(
      `
                INSERT INTO labels(label_name)
                VALUES($1)
                RETURNING *;
            `,
      [name]
    );
    console.log("Finished creating label", label);
    return label;
  } catch (error) {
    console.error("Error creating label");
    throw error;
  }
};

const addLabelToNote = async ({ labelId, noteId }) => {
  try {
    console.log("Adding label to note");
    const {
      rows: [label],
    } = await client.query(
      `
                UPDATE labels
                SET notes_Id=$2
                WHERE labels.id=$1
                RETURNING *;
            `,
      [noteId, labelId]
    );
    console.log("Finished adding label to note", label);
    return label;
  } catch (error) {
    console.error("Error adding label to note");
    throw error;
  }
};

const getAllLabels = async () => {
  try {
    console.log("Getting all labels");
    const { rows: labels } = await client.query(`
                SELECT * FROM labels;
            `);
    console.log("Finished getting all labels", labels);
    return labels;
  } catch (error) {
    console.error("Error getting all labels");
    throw error;
  }
};

const getLabelsByNoteId = async (noteId) => {
  try {
    console.log("Getting labels by note", noteId);
    const { rows } = await client.query(
      `
                SELECT * FROM labels
                WHERE notes_Id=$1;
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

const getLabelsById = async (id) => {
  try {
    console.log("Getting labels by id", id);
    const { rows } = await client.query(
      `
                SELECT * FROM labels
                WHERE id=$1;
            `,
      [id]
    );
    console.log("Finished getting labels by id", rows);
    return rows;
  } catch (error) {
    console.error("Error getting labels by id");
    throw error;
  }
};

const getLabelsByName = async (name) => {
  try {
    console.log("Getting labels by name", name);
    const { rows } = await client.query(
      `
                SELECT * FROM labels
                WHERE label_name=$1;
            `,
      [name]
    );
    console.log("Finished getting labels by name", rows);
    return rows;
  } catch (error) {
    console.error("Error getting labels by name");
    throw error;
  }
};

const deleteLabel = async (id) => {
  try {
    console.log("Deleting label", id);
    const {
      rows: [tag],
    } = await client.query(
      `
                DELETE FROM labels
                WHERE id=$1;
            `,
      [id]
    );
    console.log("Finished deleting label", rows);
    return tag;
  } catch (error) {
    console.log("Error deleting label");
    throw error;
  }
};

const getLabelsByUser = async (usersId) => {
  try {
    console.log("Getting labels by user", usersId);
    const { rows } = await client.query(
      `
                SELECT * FROM labels
                WHERE labels.notes_Id = $1;
            `,
      [usersId]
    );
    console.log("Finished getting labels by user", rows);
    return rows;
  } catch (error) {
    console.error("Error getting labels by user");
    throw error;
  }
};
module.exports = {
  createLabel,
  addLabelToNote,
  getAllLabels,
  getLabelsByNoteId,
  getLabelsById,
  getLabelsByName,
  getLabelsByUser,
  deleteLabel,
};
