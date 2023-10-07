const express = require("express");
const jwt = require("jsonwebtoken");
const usersRouter = express.Router();
const bcrypt = require("bcrypt");

const { requireUser } = require("./utils");
const { createUser, getUser, getUserByEmail } = require("../db");

//user routes will go here

//POST /api/users/register
usersRouter.post("/register", async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    res.status(401);
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }

  try {
    const _user = await getUserByEmail(email);

    if (_user) {
      next({
        name: "UserExistsError",
        message: "A user by that email already exists",
      });
    } else if (password.length < 8) {
      res.status(401);
      next({
        name: "PasswordTooShortError",
        message: "Password must be at least 8 characters",
      });
    } else {
      const user = await createUser({
        name,
        email,
        password,
      });

      if (!user) {
        next({
          name: "UserCreationError",
          message: "User does not exist",
        });
      } else {
        const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET, {
          expiresIn: "1w",
        });

        delete user.password;

        res.send({
          message: "thank you for signing up",
          token,
          user,
          success: true,
        });
      }
    }
  } catch ({ name, message }) {
    res.status(400);
    next({
      name: "Registration Error",
      message: "There was an error registering the user.",
    });
  }
});

//POST /api/users/login
usersRouter.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  // request must have both
  if (!email || !password) {
    res.status(401);
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }

  try {
    const user = await getUserByEmail(email);

    const isValid = await bcrypt.compare(password, user.password);

    if (user && isValid) {
      const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET, {
        expiresIn: "1w",
      });

      delete user.password;

      res.send({ message: "You're logged in!", token, user, success: true });
    } else {
      res.status(401);
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400);
    next({
      name: "Login Error",
      message: "There was an error logging in.",
    });
  }
});

module.exports = usersRouter;
