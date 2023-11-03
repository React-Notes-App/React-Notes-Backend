const DB_NAME = "react-todo-app";

const { Client } = require("pg"); // imports the pg module
// const postgres = require("postgres"); //imports the postgres module
const connectionString =
  process.env.DATABASE_URL || `postgres://localhost:5432/${DB_NAME}`; // location of the database hosting server - this is the default location for a postgres database running on your own computer

const client = new Client({
  connectionString,
  ssl: true,
  // process.env.NODE_ENV === "production"
  //   ? { rejectUnauthorized: false }
  //   : undefined,
});
// makes a new client

// const sql = postgres(connectionString); // generates the function for interacting with the database
module.exports = client;
// sql,
// exports the client for use in other files
