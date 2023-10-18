const client = require("./client");

const {
  //user exports
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,

  getUserById,
  getUserByEmail,

  //note exports
  createNote,
  getNote,
  getAllNotes,
  updateNote,
  deleteNote,
  getNotesByUser,
  getNotesByLabel,
  editNoteTitle,

  //item exports

  createItem,
  getItem,
  getAllItems,
  editItemName,
  deleteItem,
  getItemsByNoteId,

  //label exports

  createLabel,
  getLabel,
  getAllLabels,
  updateLabel,
  deleteLabel,
  getLabelsByUser,
} = require("./index");

const {
  usersToAdd,
  notesToAdd,
  labelsToAdd,
  itemsToAdd,
} = require("./dummyData");

const dropTables = async () => {
  try {
    //drop tables in correct order
    client.connect();
    console.log("Starting to drop tables...");

    await client.query(`
            DROP TABLE IF EXISTS labels;
            DROP TABLE IF EXISTS items;
            DROP TABLE IF EXISTS notes;
            DROP TABLE IF EXISTS users;
        `);

    console.log("Finished dropping tables!");
  } catch (error) {
    console.error("Error dropping tables!");
    throw error;
  }
};

const createTables = async () => {
  try {
    console.log("Starting to build tables...");

    await client.query(`
            CREATE TABLE users(
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                is_admin BOOLEAN DEFAULT false
            );
            
            CREATE TABLE notes(
                id SERIAL PRIMARY KEY,
                users_Id INTEGER REFERENCES users(id) NOT NULL,
                title VARCHAR(255) NOT NULL,
                color VARCHAR(255) DEFAULT 'gray',
                date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_archived BOOLEAN DEFAULT false
                );
                
            CREATE TABLE items(
                id SERIAL PRIMARY KEY,
                notes_Id INTEGER REFERENCES notes(id) ON DELETE CASCADE,
                item_name VARCHAR(255) NOT NULL,
                completed BOOLEAN DEFAULT false
                );

            CREATE TABLE labels(
                id SERIAL PRIMARY KEY,
                notes_Id INTEGER REFERENCES notes(id) ON DELETE CASCADE,
                label_name VARCHAR(255) NOT NULL
                );

            `);

    console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error;
  }
};

//create functions to add dummy data to tables

const createInitialUsers = async () => {
  console.log("Starting to create users...");

  try {
    for (let i = 0; i < usersToAdd.length; i++) {
      await createUser(usersToAdd[i]);
    }
    console.log("Finished creating users!");
  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
};

const createInitialNotes = async () => {
  try {
    console.log("Starting to create notes...");

    const notes = await Promise.all(notesToAdd.map(createNote));

    console.log("Notes created:");
    console.log(notes);
    console.log("Finished creating notes!");
  } catch (error) {
    console.error("Error creating notes!");
    throw error;
  }
};

const createInitialLabels = async () => {
  try {
    console.log("Starting to create labels...");

    const labels = await Promise.all(labelsToAdd.map(createLabel));

    console.log("Labels created:");
    console.log(labels);
    console.log("Finished creating labels!");
  } catch (error) {
    console.error("Error creating labels!");
    throw error;
  }
};

const createInitialItems = async () => {
  try {
    console.log("Starting to create items...");

    const items = await Promise.all(itemsToAdd.map(createItem));

    console.log("Items created:");
    console.log(items);
    console.log("Finished creating items!");
  } catch (error) {
    console.error("Error creating items!");
    throw error;
  }
};

//create function to rebuild database

const rebuildDB = async () => {
  try {
    await dropTables();
    await createTables();

    //initial functions
    await createInitialUsers();
    await createInitialNotes();
    await createInitialItems();
    await createInitialLabels();

    //user functions
    await getAllUsers();
    await getUserById(1);
    await getUserByEmail("John@mymail.com");
    await createUser({
      name: "Tom",
      email: "Tom@mymail.com",
      password: "password",
    });

    //note functions
    await getAllNotes();
    await getNotesByUser(1);
    await editNoteTitle({ id: 1, title: "Shopping List 2323" });

    //item functions
    await createItem({
      id: 1,
      name: "Bread",
      completed: false,
    });
    await getItemsByNoteId(1);
    await editItemName(1, "Bread");
    await getNotesByUser(1);
    //label functions
    await getAllLabels();
  } catch (error) {
    console.error("Error during rebuildDB");
    throw error;
  }
};

rebuildDB()
  .catch(console.error)
  .finally(() => client.end());
