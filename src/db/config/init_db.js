const { Client } = require("pg");
require("dotenv").config({ path: "../../../.env" });

const initDB = async () => {
  let client;
  try {
    // client = new Client({
    //   host: process.env.DB_HOST,
    //   port: process.env.DB_PORT,
    //   user: process.env.DB_USER,
    //   password: process.env.DB_PASSWORD,
    // });
    client = new Client({
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
    });

    await client.connect();

    const result = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [process.env.DB_NAME]
    );

    if (result.rows.length === 0) {
      await client.query(`CREATE DATABASE "${process.env.DB_NAME}"`);
      console.log(`База данных "${process.env.DB_NAME}" создана.`);
    } else {
      console.log(`База данных "${process.env.DB_NAME}" уже существует.`);
    }
  } catch (error) {
    console.error("Ошибка при проверке/создании базы данных:", error);
  } finally {
    if (client) await client.end();
  }
};

initDB();
