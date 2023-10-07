//require user and other utilities here

const express = require("express");

const requireUser = (req, res, next) => {
  if (!req.user) {
    next({
      name: "MissingUserError",
      message: "You must be logged in to perform this action",
    });
  }
  next();
};

module.exports = {
  requireUser,
};
