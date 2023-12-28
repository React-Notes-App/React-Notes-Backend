require("dotenv").config();
const apiRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { getUserById } = require("../db");

// attach req.user to the user object if a user is logged in

apiRouter.use(async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");

  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const { id } = jwt.verify(token, JWT_SECRET);

      if (id) {
        req.user = await getUserById(id);
        next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: "AuthorizationHeaderError",
      message: `Authorization token must start with ${prefix}`,
    });
  }
});

apiRouter.use((req, res, next) => {
  if (req.user) {
    console.log("User is set:", req.user);
  }
  next();
});

apiRouter.get("/health", (req, res, next) => {
  res.send({
    healthy: true,
  });
});

//place routers here
const usersRouter = require("./users");
const notesRouter = require("./notes");
const emailsRouter = require("./email");

apiRouter.use("/users", usersRouter);
apiRouter.use("/notes", notesRouter);
apiRouter.use("/email", emailsRouter);

apiRouter.use((error, req, res, next) => {
  res.send({
    name: error.name,
    message: error.message,
  });
});

//404 handler

apiRouter.use("*", (req, res, next) => {
  res.status(404).send("Route not found");
});

module.exports = apiRouter;
