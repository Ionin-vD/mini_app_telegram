const pool = require("../config/config");

const createUser = async (
  chat_id,
  fio,
  isAdmin = false,
  isAuth = false,
  isDeleted = false
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const userResult = await client.query(
      "INSERT INTO users (chat_id) VALUES ($1) RETURNING id",
      [chat_id]
    );
    const userId = userResult.rows[0].id;

    const userDataResult = await client.query(
      "INSERT INTO user_data (user_id, fio, isAdmin, isAuth, isDeleted) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [userId, fio, isAdmin, isAuth, isDeleted]
    );

    await client.query("COMMIT");

    return userDataResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const findUserByChatId = async (chat_id) => {
  const result = await pool.query("SELECT * FROM users WHERE chat_id = $1", [
    chat_id,
  ]);
  return result.rows[0];
};

const getAll = async () => {
  const result = await pool.query(
    "SELECT id, fio, isAdmin, isAuth FROM user_data"
  );
  return result.rows;
};

module.exports = { createUser, findUserByChatId, getAll };
