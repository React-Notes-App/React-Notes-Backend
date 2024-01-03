const express = require("express");
const jwt = require("jsonwebtoken");
const usersRouter = express.Router();
const bcrypt = require("bcrypt");

const { requireUser, requireAdmin } = require("./utils");
const {
  getAllUsers,
  createUser,
  getUser,
  getUserByEmail,
  getUserById,
  updateUser,
} = require("../db");

//user routes will go here

//Register User
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

//Login User
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

//GET All Users
//GET /api/users/all_users

usersRouter.get("/all_users", requireAdmin, async (req, res, next) => {
  try {
    const allUsers = await getAllUsers();

    res.send({
      success: true,
      allUsers: allUsers,
    });
  } catch ({ name, message }) {
    next({
      name: "Error Getting All Users",
      message: "There was an error getting all users.",
    });
  }
});

//GET User Profile
//GET /api/users/me

usersRouter.get("/me", requireUser, async (req, res, next) => {
  try {
    const user = await getUserById(req.user.id);

    res.send({
      success: true,
      user: user,
    });
  } catch ({ name, message }) {
    next({
      name: "Error Getting User",
      message: "There was an error getting the user.",
    });
  }
});

//Update User Info
//PATCH /api/users/update_user

usersRouter.patch("/me/edit-info", requireUser, async (req, res, next) => {
  const { id } = req.user;
  const { name, email, password, picture } = req.body;

  const fields = {};

  if (name) {
    fields.name = name;
  }

  if (email) {
    fields.email = email;
  }

  if (password) {
    fields.password = password;
  }

  if (picture) {
    fields.picture = picture;
  }
  try {
    const user = await updateUser(id, fields);

    res.send({
      success: true,
      user: user,
    });
  } catch ({ name, message }) {
    next({
      name: "Error Updating User",
      message: "There was an error updating the user.",
    });
  }
});

//Update User Password (requires user email)
//PATCH /api/users/update_password

usersRouter.patch("/me/reset-password", async (req, res, next) => {
  const { email, password } = req.body;

  const fields = {};

  if (password) {
    fields.password = password;
  }

  const userEmail = await getUserByEmail(email);
  const id = userEmail.id;

  if (userEmail) {
    try {
      const user = await updateUser(id, fields);

      res.send({
        success: true,
        user: user,
      });
    } catch ({ name, message }) {
      next({
        name: "Error Updating User",
        message: "There was an error updating the user.",
      });
    }
  }
});

//Delete User
//DELETE /api/users/delete_user

usersRouter.delete("/me/delete_user", requireUser, async (req, res, next) => {
  try {
    const user = await getUserById(req.user.id);

    if (user) {
      await deleteUser(req.user.id);
      res.send({
        success: true,
        message: "User deleted",
      });
    } else {
      next({
        name: "Error Deleting User",
        message: "There was an error deleting the user.",
      });
    }
  } catch ({ name, message }) {
    next({
      name: "Error Deleting User",
      message: "There was an error deleting the user.",
    });
  }
});

module.exports = usersRouter;
