const client = require("./client");

const createItem = async ({ noteId, name }) => {
  try {
    const {
      rows: [item],
    } = await client.query(
      `
              INSERT INTO items( notes_Id, item_name)
              VALUES($1, $2)
              RETURNING *;
          `,
      [noteId, name]
    );
    console.log("Finished creating item", item);
    return item;
  } catch (error) {
    console.error("Error creating item");
    throw error;
  }
};

const updateItem = async (id, fields = {}) => {
  console.log("Updating item");
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString.length === 0) {
    return;
  }
  const {
    rows: [item],
  } = await client.query(
    `
              UPDATE items
              SET ${setString}
              WHERE id=${id}
              RETURNING *;
          `,
    Object.values(fields)
  );
  console.log("Finished updating item", item);
  return item;
};

const getAllItems = async () => {
  try {
    console.log("Getting all items");
    const { rows: items } = await client.query(`
              SELECT * FROM items;
          `);
    console.log("Finished getting all items", items);
    return items;
  } catch (error) {
    console.error("Error getting all items");
    throw error;
  }
};

const getItemsByNoteId = async (noteId) => {
  try {
    console.log("Getting items by note", noteId);
    const { rows } = await client.query(
      `
                      SELECT * FROM items
                      WHERE notes_Id =$1;
                  `,
      [noteId]
    );
    console.log("Finished getting items by note", rows);
    return rows;
  } catch (error) {
    console.error("Error getting items by note");
    throw error;
  }
};

module.exports = {
  createItem,
  getAllItems,
  getItemsByNoteId,
  updateItem,
};
