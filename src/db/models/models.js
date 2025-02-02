const pool = require("../config/config");

const createUserM = async (
  chat_id,
  fio,
  isAdmin = false,
  isAuth = false,
  isDeleted = false
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await client.query(
      "INSERT INTO user_data (chat_id, fio, isAdmin, isAuth, isDeleted) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [chat_id, fio, isAdmin, isAuth, isDeleted]
    );
    await client.query("COMMIT");

    return result.rows[0];
  } catch (error) {
    console.log(error);
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const findUserByChatIdM = async (chat_id) => {
  try {
    const result = await pool.query(
      `SELECT id, fio, isAdmin, isAuth FROM user_data WHERE chat_id = $1`,
      [chat_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getAllUserM = async () => {
  try {
    const result = await pool.query(
      `SELECT id, fio, isAdmin, isAuth FROM user_data`
    );
    return result.rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getAllScheduleM = async () => {
  try {
    const result = await pool.query(
      ` SELECT
      schedule.id,
      user_data.fio,
      survey_topics.themes,
      schedule.data,
      schedule.time
    FROM
      schedule
    LEFT JOIN
      user_data ON schedule.chat_id = user_data.chat_id
    LEFT JOIN
      survey_topics ON schedule.themes_id = survey_topics.id`
    );
    return result.rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getFreeScheduleM = async () => {
  try {
    const result = await pool.query(
      ` SELECT
    schedule.id,
    user_data.fio,
    survey_topics.themes,
    schedule.data,
    schedule.time
  FROM
    schedule
  LEFT JOIN
    user_data ON schedule.chat_id = user_data.chat_id
  LEFT JOIN
    survey_topics ON schedule.themes_id = survey_topics.id
  WHERE
    schedule.chat_id IS NULL`
    );
    return result.rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const addFreeScheduleM = async (
  chatId = null,
  themesId = null,
  date = "02.02.2025",
  time = "10:00:00"
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await client.query(
      "INSERT INTO schedule (chat_id, themes_id, data, time) VALUES ($1, $2, $3, $4) RETURNING *",
      [chatId, themesId, date, time]
    );
    await client.query("COMMIT");

    return result.rows[0];
  } catch (error) {
    console.log(error);
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const deleteScheduleM = async (id) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    console.log("mas id in model: " + id);

    const result = await client.query(
      "DELETE FROM schedule WHERE id = ANY($1) AND chat_id IS null",
      [id]
    );
    await client.query("COMMIT");

    return result.rows[0];
  } catch (error) {
    console.log(error);
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  createUserM,
  findUserByChatIdM,
  getAllUserM,
  getAllScheduleM,
  getFreeScheduleM,
  addFreeScheduleM,
  deleteScheduleM,
};
