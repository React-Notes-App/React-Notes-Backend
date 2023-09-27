const express = require("express");
const server = express();

const cors = require("cors");
server.use(cors());

const morgan = require("morgan");
server.use(morgan("dev"));

server.use(express.json());

server.use("/api", require("./api"));

server.use((error, req, res, next) => {
  res.send({
    name: error.name,
    message: error.message,
  });
});

server.use("*", (req, res, next) => {
  res.send({
    message: "Route not found",
  });
});

const client = require("./db/client");

const PORT = process.env.PORT || 4000;

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    await client.connect();
    console.log("Database is open for business!");
  } catch (error) {
    console.error("Database is closed for repairs!\n", error);
  }
});
