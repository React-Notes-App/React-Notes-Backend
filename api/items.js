const express = require("express");
const itemsRouter = express.Router();
const jwt = require("jsonwebtoken");
const usersRouter = express.Router();
const bcrypt = require("bcrypt");

const { requireUser } = require("./utils");
const {
  getAllItems,
  getItemsByUser,
  getItemsByLabel,
  createItem,
  editItem,
  destroyItem,
} = require("../db");

//GET all items
//GET /api/items/all_items

itemsRouter.get("/all_items", async (req, res, next) => {
  try {
    const items = await getAllItems();
    if (!items) {
      next({
        name: "NoItemsError",
        message: "There are no items in the database",
      });
    } else {
      res.send({ items: items, success: true });
    }
  } catch (error) {
    next(error);
  }
});

//Post new item
//POST /api/items/new_item

itemsRouter.post("/new_item/:noteId", requireUser, async (req, res, next) => {
  try {
    const noteId = req.params.noteId;
    const { name } = req.body;
    const item = await createItem({ noteId, name });
    if (!item) {
      next({
        name: "ItemCreationError",
        message: "Item does not exist",
      });
    } else {
      res.send({ item: item, success: true });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = itemsRouter;
