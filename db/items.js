const client = require("./client");

const createItem = async ({ id, itemName, completed }) => {
  try {
    console.log("Creating item", id, itemName);
    const {
      rows: [item],
    } = await client.query(
      `
              INSERT INTO items( notes_Id, item_name, completed)
              VALUES($1, $2, $3)
              RETURNING *;
          `,
      [id, itemName, completed]
    );
    console.log("Finished creating item", item);
    return item;
  } catch (error) {
    console.error("Error creating item");
    throw error;
  }
};

const editItemName = async ({ id, name }) => {
  try {
    console.log("Updating item name", id, name);
    const {
      rows: [item],
    } = await client.query(
      `
            UPDATE items
            SET item_name=$2
            WHERE id=$1
            RETURNING *;
        `,
      [id, name]
    );
    console.log("Finished updating item", item);
    return item;
  } catch (error) {
    console.error("Error updating item");
    throw error;
  }
};

const editItemStatus = async (id, completed) => {
  try {
    console.log("Updating item status", id, completed);
    const {
      rows: [item],
    } = await client.query(
      `
            UPDATE items
            SET completed=$2
            WHERE id=$1
            RETURNING *;
        `,
      [id, completed]
    );
    console.log("Finished updating item status", item);
    return item;
  } catch (error) {
    console.error("Error updating item status");
    throw error;
  }
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

const deleteItem = async (id) => {
  try {
    console.log("Deleting item", id);
    const {
      rows: [item],
    } = await client.query(
      `
              DELETE FROM items
              WHERE id=$1
              RETURNING *;
          `,
      [id]
    );
    console.log("Finished deleting item", item);
    return item;
  } catch (error) {
    console.error("Error deleting item");
    throw error;
  }
};

module.exports = {
  createItem,
  getAllItems,
  getItemsByNoteId,
  editItemName,
  editItemStatus,
  deleteItem,
};
