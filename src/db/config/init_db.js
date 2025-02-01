const { Pool } = require("pg");
const messages = require("../../../messages");
require("dotenv").config({
  path: "../../../.env",
});

const initDB = async () => {
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
    const dbExists = await pool.query(
      `SELECT 1 FROM pg_database WHERE datname = '${process.env.DB_NAME}'`
    );

    if (dbExists.rows.length === 0) {
      await pool.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log(`База данных ${process.env.DB_NAME} создана.`);
    }

    const dbPool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS user_data (
        id SERIAL PRIMARY KEY,
        chat_id VARCHAR(255) NOT NULL UNIQUE,
        fio VARCHAR(255) NOT NULL,
        isAdmin BOOLEAN DEFAULT FALSE,
        isAuth BOOLEAN DEFAULT FALSE,
        isDeleted BOOLEAN DEFAULT FALSE
      );
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS survey_topics (
        id SERIAL PRIMARY KEY,
        themes VARCHAR(255) NOT NULL
      );
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS schedule (
        id SERIAL PRIMARY KEY,
        chat_id VARCHAR(255) REFERENCES user_data(chat_id),
        themes_id INT REFERENCES survey_topics(id),
        data DATE NOT NULL,
        time TIME WITHOUT TIME ZONE NOT NULL
      );
    `);

    await dbPool.query(`
        CREATE TABLE IF NOT EXISTS progress (
          id SERIAL PRIMARY KEY,
          chat_id VARCHAR(255) REFERENCES user_data(chat_id),
          themes_id INT REFERENCES survey_topics(id),
          status INT DEFAULT 0
        );
    `);
  } catch (error) {
    console.error(messages.errorDb, error);
  } finally {
    await pool.end();
  }
};

initDB();
