const client = require("./client");
const bcrypt = require("bcrypt");

const createUser = async ({ name, email, password, is_admin }) => {
  try {
    const SALT_COUNT = 10;
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
    const {
      rows: [user],
    } = await client.query(
      `
            INSERT INTO users(name, email, password, is_admin)
            VALUES($1, $2, $3, $4)
            ON CONFLICT (email) DO NOTHING
            RETURNING id, name, email, is_admin;
        `,
      [name, email, hashedPassword, is_admin]
    );
    console.log("Finished creating user", user);
    return user;
  } catch (error) {
    console.error("Error creating user");
    throw error;
  }
};

const updateUser = async ({ id, field = {} }) => {
  const setString = Object.keys(field)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString.length === 0) {
    return;
  }
  try {
    const {
      rows: [user],
    } = await client.query(
      `
            UPDATE users
            SET ${setString}
            WHERE id=${id}
            RETURNING *;
        `,
      Object.values(field)
    );
    delete user.password;
    console.log("Finished updating user", user);
    return user;
  } catch (error) {
    console.error("Error updating user");
    throw error;
  }
};

const getAllUsers = async () => {
  try {
    const { rows: users } = await client.query(`
                SELECT id, name, email, is_admin
                FROM users;
            `);
    console.log("Finished getting all users", users);
    return users;
  } catch (error) {
    console.error("Error getting all users");
    throw error;
  }
};

const getUser = async ({ email, password }) => {
  const userByEmail = await getUserByEmail(email);
  const hashedPassword = userByEmail.password;
  const isValid = await bcrypt.compare(password, hashedPassword);

  try {
    const {
      rows: [user],
    } = await client.query(
      `
                SELECT *
                FROM users
                WHERE id=${userByEmail.id};
            `
    );
    if (!isValid) {
      console.log("Invalid credentials");
      return null;
    } else {
      console.log("Finished getting user", user);
      return user;
    }
  } catch (error) {
    console.error("Error getting user");
    throw error;
  }
};

const getUserByEmail = async (email) => {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
                SELECT *
                FROM users
                WHERE email=$1;
            `,
      [email]
    );
    console.log("Finished getting user by email", user);
    return user;
  } catch (error) {
    console.error("Error getting user by email");
    throw error;
  }
};

const getUserById = async (userId) => {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
                SELECT id, name, email, is_admin
                FROM users
                WHERE id=$1
            `,
      [userId]
    );
    console.log("Finished getting user by id", user);
    return user;
  } catch (error) {
    console.error("Error getting user by id");
    throw error;
  }
};

module.exports = {
  createUser,
  getUser,
  getUserByEmail,
  getUserById,
  getAllUsers,
  updateUser,
};
