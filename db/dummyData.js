const usersToAdd = [
  {
    name: "John",
    email: "John@mymail.com",
    password: "password",
    is_admin: true,
  },
  {
    name: "Jane",
    email: "Jane@mymail.com",
    password: "password",
  },
  {
    name: "Joe",
    email: "Joe@mymail.com",
    password: "password",
  },
];

const notesToAdd = [
  {
    userId: 1,
    title: "Groceries",
    color: "red",
    date: new Date(),
  },
  {
    userId: 1,
    title: "Work",
    color: "blue",
    date: new Date(),
  },
  {
    userId: 2,
    title: "Climbing",
    color: "green",
    date: new Date(),
  },
  {
    userId: 3,
    title: "Home",
    color: "yellow",
    date: new Date(),
  },
];

const itemsToAdd = [
  {
    noteId: 1,
    name: "Milk",
    completed: false,
  },
  {
    noteId: 1,
    name: "Eggs",
    completed: false,
  },
  {
    noteId: 2,
    name: "Write Code",
    completed: false,
  },
  {
    noteId: 2,
    name: "Review Code",
    completed: false,
  },
  {
    noteId: 3,
    name: "5x3's",
    completed: false,
  },
  {
    noteId: 3,
    name: "Suicides",
    completed: false,
  },
  {
    noteId: 4,
    name: "Dishes",
    completed: false,
  },
  {
    noteId: 4,
    name: "Vacuum",
    completed: false,
  },
];
const labelsToAdd = [
  {
    userId: 1,
    noteId: 1,
    label_name: "Groceries",
  },
  {
    userId: 1,
    noteId: 2,
    label_name: "Work",
  },
  {
    userId: 2,
    noteId: 3,
    label_name: "Climbing",
  },
  {
    userId: 3,
    noteId: 4,
    label_name: "Home",
  },
];

module.exports = {
  usersToAdd,
  notesToAdd,
  itemsToAdd,
  labelsToAdd,
};
