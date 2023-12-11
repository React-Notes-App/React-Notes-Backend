const usersToAdd = [
  {
    name: "John",
    email: "John@mymail.com",
    password: "password",
    is_admin: true,
    picture: "https://i.imgur.com/5r6lxhf.png",
  },
  {
    name: "Jane",
    email: "Jane@mymail.com",
    password: "password",
    is_admin: false,
    picture: "https://i.imgur.com/5r6lxhf.png",
  },
  {
    name: "Joe",
    email: "Joe@mymail.com",
    password: "password",
    is_admin: false,
    picture: "https://i.imgur.com/5r6lxhf.png",
  },
];

const notesToAdd = [
  {
    userId: 1,
    title: "Groceries",
    color: "rgb(33, 150, 243)",
    date: new Date(),
    is_archived: false,
    has_checklist: true,
    is_deleted: false,
  },
  {
    userId: 1,
    title: "Work",
    color: "rgb(255, 193, 7)",
    date: new Date(),
    is_archived: false,
    has_checklist: true,
    is_deleted: false,
  },
  {
    userId: 2,
    title: "Climbing",
    color: "green",
    date: new Date(),
    is_archived: false,
    has_checklist: true,
    is_deleted: false,
  },
  {
    userId: 2,
    title: "Home",
    color: "yellow",
    date: new Date(),
    is_archived: false,
    has_checklist: true,
    is_deleted: false,
  },
];

const itemsToAdd = [
  {
    id: 1,
    itemName: "Milk",
    completed: false,
  },
  {
    id: 1,
    itemName: "Eggs",
    completed: false,
  },
  {
    id: 2,
    itemName: "Write Code",
    completed: false,
  },
  {
    id: 2,
    itemName: "Review Code",
    completed: false,
  },
  {
    id: 3,
    itemName: "5x3's",
    completed: false,
  },
  {
    id: 3,
    itemName: "Suicides",
    completed: false,
  },
  {
    id: 4,
    itemName: "Dishes",
    completed: false,
  },
  {
    id: 4,
    itemName: "Vacuum",
    completed: false,
  },
];
const labelsToAdd = [
  {
    userId: 1,
    label_name: "Groceries",
  },
  {
    userId: 1,
    label_name: "Work",
  },
  {
    userId: 1,
    label_name: "Climbing",
  },
  {
    userId: 1,
    label_name: "Home",
  },
  {
    userId: 2,
    label_name: "Important",
  },
  {
    userId: 2,
    label_name: "Mountain Biking",
  },
  {
    userId: 2,
    label_name: "School",
  },
  {
    userId: 2,
    label_name: "Chores",
  },
];

const notes_labelsToAdd = [
  {
    labelId: 1,
    noteId: 1,
  },
  {
    labelId: 2,
    noteId: 1,
  },
  {
    labelId: 3,
    noteId: 2,
  },
  {
    labelId: 4,
    noteId: 2,
  },
  {
    labelId: 5,
    noteId: 3,
  },
  {
    labelId: 6,
    noteId: 3,
  },
  {
    labelId: 7,
    noteId: 4,
  },
  {
    labelId: 8,
    noteId: 4,
  },
  {
    labelId: 1,
    noteId: 2,
  },
];

module.exports = {
  usersToAdd,
  notesToAdd,
  itemsToAdd,
  labelsToAdd,
  notes_labelsToAdd,
};
