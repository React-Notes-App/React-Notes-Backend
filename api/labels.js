const express = require("express");
const labelsRouter = express.Router();
const jwt = require("jsonwebtoken");
const usersRouter = express.Router();
const bcrypt = require("bcrypt");

const { requireUser } = require("./utils");
const {
  getAllLabels,
  getLabelsByUser,
  createLabel,
  addLabelToNote,
  getLabelsByName,
} = require("../db");

//Get all labels
//GET /api/labels/all_labels
labelsRouter.get("/all_labels", async (req, res, next) => {
  try {
    const labels = await getAllLabels();

    res.send({
      labels,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

//GET labels by user
//GET /api/labels/user
labelsRouter.get("/user", requireUser, async (req, res, next) => {
  try {
    const id = req.user.id;
    const labels = await getLabelsByUser(id);
    if (!labels) {
      next({
        name: "NoLabelsError",
        message: "There are no labels in the database",
      });
    } else {
      res.send({ labels: labels, success: true });
    }
  } catch (error) {
    next(error);
  }
});

//POST new label
//POST /api/labels/new_label
labelsRouter.post("/new_label", requireUser, async (req, res, next) => {
  try {
    const { name } = req.body;
    const label = await createLabel({ name });
    if (!label) {
      next({
        name: "LabelCreationError",
        message: "Label does not exist",
      });
    } else {
      res.send({ label: label, success: true });
    }
  } catch (error) {
    next(error);
  }
});

//Patch label to note
//PATCH /api/labels/:id
labelsRouter.patch(
  "/:labelId/add-to-note",
  requireUser,
  async (req, res, next) => {
    try {
      const labelId = req.params.labelId;
      const { noteId } = req.body;
      const label = await addLabelToNote({
        labelId,
        noteId,
      });
      if (!label) {
        next({
          name: "LabelCreationError",
          message: "Label does not exist",
        });
      } else {
        res.send({ label: label, success: true });
      }
    } catch (error) {
      next(error);
    }
  }
);
module.exports = labelsRouter;
