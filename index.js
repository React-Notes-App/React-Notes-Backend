//This is the entry point for our server
const express = require("express");
const server = express();

// enable cross-origin resource sharing to proxy api requests
// from localhost:3000 to localhost:4000 in local dev env
const cors = require("cors");
server.use(cors());

// create logs for everything
const morgan = require("morgan");
server.use(morgan("dev"));

// handle application/json requests
const maxRequestBodySize = 52428800; // 50mb
server.use(express.json({ limit: maxRequestBodySize }));
server.use(express.urlencoded({ extended: true, limit: maxRequestBodySize }));

// here's our API
server.use("/api", require("./api"));

//error handler
server.use((error, req, res, next) => {
  res.send({
    name: error.name,
    message: error.message,
  });
});

//404 handler
server.use("*", (req, res, next) => {
  res.send({
    message: "Route not found",
  });
});

//connect to database
const client = require("./db/client");

//connect to server
const PORT = process.env.PORT || 4000;

//// define a server handle to close open tcp connection after unit tests have run
server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    await client.connect();
    console.log("Database is open for business!");
  } catch (error) {
    console.error("Database is closed for repairs!\n", error);
  }
});
