const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config({ path: ".env" });

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false,
  }
);

const UserData = sequelize.define(
  "user_data",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    chat_id: { type: DataTypes.BIGINT, unique: true, allowNull: false },
    fio: { type: DataTypes.STRING, allowNull: false },
    isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false },
    isAuth: { type: DataTypes.BOOLEAN, defaultValue: false },
    isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { timestamps: false }
);

const SurveyTopics = sequelize.define(
  "survey_topics",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    themes: { type: DataTypes.STRING, allowNull: false },
  },
  { timestamps: false }
);

const Schedule = sequelize.define(
  "schedule",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    chat_id: { type: DataTypes.BIGINT, allowNull: true },
    themes_id: { type: DataTypes.INTEGER, allowNull: true },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    time: { type: DataTypes.TIME, allowNull: false },
  },
  { timestamps: false }
);

const Progress = sequelize.define(
  "progress",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    chat_id: { type: DataTypes.BIGINT, allowNull: false },
    themes_id: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  { timestamps: false }
);

// Schedule и Progress ссылаются на user_data (по chat_id)
UserData.hasMany(Schedule, { foreignKey: "chat_id" });
Schedule.belongsTo(UserData, { foreignKey: "chat_id" });

UserData.hasMany(Progress, { foreignKey: "chat_id" });
Progress.belongsTo(UserData, { foreignKey: "chat_id" });

// Schedule и Progress ссылаются на survey_topics (по themes_id)
SurveyTopics.hasMany(Schedule, { foreignKey: "themes_id" });
Schedule.belongsTo(SurveyTopics, { foreignKey: "themes_id" });

SurveyTopics.hasMany(Progress, { foreignKey: "themes_id" });
Progress.belongsTo(SurveyTopics, { foreignKey: "themes_id" });

sequelize
  .sync({ force: false })
  .then(() => console.log("База данных синхронизирована"))
  .catch((err) => console.error("Ошибка синхронизации базы данных: ", err));

module.exports = { sequelize, UserData, SurveyTopics, Schedule, Progress };
