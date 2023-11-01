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

const createLabel = async ({ userId, label_name }) => {
  try {
    console.log("Creating label", userId, label_name);
    const {
      rows: [label],
    } = await client.query(
      `
                INSERT INTO labels (users_Id, label_name)
                VALUES ($1, $2)
                RETURNING *;
            `,
      [userId, label_name]
    );
    console.log("Finished creating label", label);
    return label;
  } catch (error) {
    console.error("Error creating label");
    throw error;
  }
};

const editLabel = async (labelId, label_name) => {
  try {
    console.log("Editing label", labelId, label_name);
    const {
      rows: [label],
    } = await client.query(
      `
                UPDATE labels
                SET label_name=$2
                WHERE id=$1
                RETURNING *;

            `,
      [labelId, label_name]
    );
    console.log("Finished editing label", label);
    const {
      rows: [{ note_count }],
    } = await client.query(
      `
                SELECT count(notes_labels.labels_Id)::int AS note_count
                FROM notes_labels
                WHERE notes_labels.labels_Id=$1;

            `,
      [labelId]
    );

    return { ...label, note_count };
  } catch (error) {
    console.error("Error editing label");
    throw error;
  }
};

const getLabelsByUser = async (userId) => {
  try {
    console.log("Getting labels by user", userId);
    const { rows: labels } = await client.query(
      `
                SELECT labels.*, count(notes_labels.labels_Id)::int AS note_count
                FROM labels
                LEFT OUTER JOIN notes_labels ON labels.id = notes_labels.labels_Id
                WHERE labels.users_Id=$1
                GROUP BY labels.id
                ORDER BY labels.id asc;
            `,
      [userId]
    );
    console.log("Finished getting labels by user", labels);
    return labels;
  } catch (error) {
    console.error("Error getting labels by user");
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

const getLabelByName = async (name) => {
  try {
    console.log("Getting labels by label_name", name);
    const { rows } = await client.query(
      `
                SELECT * FROM labels
                WHERE label_name=$1;
            `,
      [name]
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
                WHERE id=$1
                Returning *;
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
  editLabel,
  getLabelsByUser,
  getLabelsById,
  getLabelByName,
  deleteLabel,
};
