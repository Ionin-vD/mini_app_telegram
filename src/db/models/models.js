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
    const userDataResult = await client.query(
      "INSERT INTO user_data (chat_id, fio, isAdmin, isAuth, isDeleted) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [chat_id, fio, isAdmin, isAuth, isDeleted]
    );
    await client.query("COMMIT");

    return userDataResult.rows[0];
  } catch (error) {
    console.log(error);

    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const findUserByChatIdM = async (chat_id) => {
  const result = await pool.query(
    `SELECT id, fio, isAdmin, isAuth FROM user_data WHERE chat_id = $1`,
    [chat_id]
  );
  return result.rows[0];
};

const getAllUserM = async () => {
  const result = await pool.query(
    `SELECT id, fio, isAdmin, isAuth FROM user_data`
  );
  return result.rows;
};

const getAllScheduleM = async () => {
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
};

const getFreeScheduleM = async () => {
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
};

module.exports = {
  createUserM,
  findUserByChatIdM,
  getAllUserM,
  getAllScheduleM,
  getFreeScheduleM,
};
