const client = require("./client");

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

const createLabel = async ({ label_name, noteId }) => {
  try {
    console.log("Creating label", label_name);
    const {
      rows: [label],
    } = await client.query(
      `
                INSERT INTO labels(label_name, notes_Id)
                VALUES($1, $2)
                RETURNING *;
            `,
      [label_name, noteId]
    );
    console.log("Finished creating label", label);
    return label;
  } catch (error) {
    console.error("Error creating label");
    throw error;
  }
};

const addLabelToNote = async (noteId, labelId) => {
  try {
    console.log("Adding label to note", noteId, labelId);
    const {
      rows: [label],
    } = await client.query(
      `
                UPDATE labels
                SET notes_Id=$1
                WHERE labels.id=$2
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

const removeLabelFromNote = async (labelId, noteId) => {
  try {
    console.log("Removing label from note", labelId, noteId);
    const {
      rows: [label],
    } = await client.query(
      `
                UPDATE labels
                SET notes_Id=NULL
                WHERE labels.id=$1
                RETURNING *;
            `,
      [noteId, labelId]
    );
    console.log("Finished removing label from note", label);
    return label;
  } catch (error) {
    console.error("Error removing label from note");
    throw error;
  }
};

const editLabel = async (id, fields = {}) => {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString.length === 0) {
    return;
  }
  try {
    console.log("Editing label", id, fields);
    const {
      rows: [label],
    } = await client.query(
      `
                UPDATE labels
                SET ${setString}
                WHERE labels.id=${id}
                RETURNING *;
            `,
      [...Object.values(fields)]
    );
    console.log("Finished editing label", label);
    return label;
  } catch (error) {
    console.error("Error editing label");
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

const getLabelsByName = async (label_name) => {
  try {
    console.log("Getting labels by label_name", label_name);
    const { rows } = await client.query(
      `
                SELECT * FROM labels
                WHERE label_name=$1;
            `,
      [label_name]
    );
    console.log("Finished getting labels by label_name", rows);
    return rows;
  } catch (error) {
    console.error("Error getting labels by label_name");
    throw error;
  }
};

const deleteLabel = async (labelId) => {
  try {
    console.log("Deleting label", labelId);
    const {
      rows: [label],
    } = await client.query(
      `
                DELETE FROM labels
                WHERE id=$1;
            `,
      [labelId]
    );
    console.log("Finished deleting label", label);
    return label;
  } catch (error) {
    console.log("Error deleting label");
    throw error;
  }
};

module.exports = {
  getAllLabels,
  createLabel,
  addLabelToNote,
  removeLabelFromNote,
  editLabel,
  getLabelsByNoteId,
  getLabelsById,
  getLabelsByName,
  getLabelsByUser,
  deleteLabel,
};
