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

const Courses = sequelize.define(
  "courses",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    admin_id: { type: DataTypes.BIGINT, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
  },
  { timestamps: false }
);

const FeedBackOfCourse = sequelize.define(
  "feedback_of_course",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    course_id: { type: DataTypes.BIGINT, allowNull: false },
    feedback: { type: DataTypes.STRING, allowNull: false },
  },
  { timestamps: false }
);

const Users = sequelize.define(
  "users",
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

const CoursesOfUsers = sequelize.define(
  "courses_of_users",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.BIGINT, allowNull: false },
    course_id: { type: DataTypes.BIGINT, allowNull: false },
    auth_in_course: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { timestamps: false }
);

const ThemesOfCourses = sequelize.define(
  "themes_of_courses",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    course_id: { type: DataTypes.BIGINT, allowNull: false },
  },
  { timestamps: false }
);

const QuestionsOfThemes = sequelize.define(
  "questions_of_themes",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    theme_id: { type: DataTypes.BIGINT, allowNull: false },
  },
  { timestamps: false }
);

const Schedule = sequelize.define(
  "schedule",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.BIGINT, allowNull: true },
    theme_id: { type: DataTypes.BIGINT, allowNull: true },
    course_id: { type: DataTypes.BIGINT, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    time: { type: DataTypes.TIME, allowNull: false },
  },
  { timestamps: false }
);

const Progress = sequelize.define(
  "progress",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.BIGINT, allowNull: false },
    theme_id: { type: DataTypes.BIGINT, allowNull: true },
    status: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  { timestamps: false }
);

// 1. Связь между курсами и пользователями (администратор курса)
// Один курс принадлежит одному пользователю (администратору)
Courses.belongsTo(Users, { foreignKey: "admin_id", as: "admin" });
// Один пользователь (администратор) может создавать несколько курсов
Users.hasMany(Courses, { foreignKey: "admin_id", as: "adminCourses" });

// 2. Связь между курсами и отзывами
// Один отзыв принадлежит одному курсу
FeedBackOfCourse.belongsTo(Courses, { foreignKey: "course_id" });
// Один курс может иметь множество отзывов
Courses.hasMany(FeedBackOfCourse, { foreignKey: "course_id" });

// 3. Связь "многие ко многим" между пользователями и курсами через таблицу CoursesOfUsers
// Один пользователь может быть записан на несколько курсов
Users.belongsToMany(Courses, {
  through: CoursesOfUsers,
  foreignKey: "user_id", // ключ, связывающий текущую модель (Users) с CoursesOfUsers
  otherKey: "course_id", // ключ, связывающий Courses с CoursesOfUsers
  as: "courses",
});
// Один курс может содержать множество пользователей
Courses.belongsToMany(Users, {
  through: CoursesOfUsers,
  foreignKey: "course_id",
  otherKey: "user_id",
  as: "users",
});

// 4. Связь между курсами и темами
// Одна тема принадлежит одному курсу
ThemesOfCourses.belongsTo(Courses, { foreignKey: "course_id" });
// Один курс может содержать несколько тем
Courses.hasMany(ThemesOfCourses, { foreignKey: "course_id" });

// 5. Связь между темами и вопросами
// Один вопрос принадлежит одной теме
QuestionsOfThemes.belongsTo(ThemesOfCourses, { foreignKey: "theme_id" });
// Одна тема может содержать множество вопросов
ThemesOfCourses.hasMany(QuestionsOfThemes, { foreignKey: "theme_id" });

// 6. Связь между пользователями и расписанием
// Запись в расписании принадлежит пользователю
Schedule.belongsTo(Users, { foreignKey: "user_id" });
// Пользователь может иметь несколько записей в расписании
Users.hasMany(Schedule, { foreignKey: "user_id" });

// Связь между темами и расписанием
// Запись в расписании относится к определённой теме курса
Schedule.belongsTo(ThemesOfCourses, { foreignKey: "theme_id" });
// Одна тема может присутствовать в расписании у разных пользователей
ThemesOfCourses.hasMany(Schedule, { foreignKey: "theme_id" });

// Связь между курсами и расписанием
// Запись в расписании относится к определённой курса
Schedule.belongsTo(Courses, { foreignKey: "course_id" });
// Одна тема может присутствовать в расписании у разных пользователей
Courses.hasMany(Schedule, { foreignKey: "course_id" });

// 7. Связь между пользователями и прогрессом
// Запись о прогрессе принадлежит пользователю
Progress.belongsTo(Users, { foreignKey: "user_id" });
// Пользователь может иметь несколько записей прогресса
Users.hasMany(Progress, { foreignKey: "user_id" });

// Связь между темами и прогрессом
// Запись о прогрессе относится к определённой теме
Progress.belongsTo(ThemesOfCourses, { foreignKey: "theme_id" });
// Одна тема может иметь несколько записей прогресса (у разных пользователей)
ThemesOfCourses.hasMany(Progress, { foreignKey: "theme_id" });

sequelize
  .sync({ force: false })
  .then(async () => {
    const count = await Users.count();

    if (count === 0) {
      await Users.bulkCreate([
        {
          chat_id: process.env.CHAT_ID,
          fio: "SUPER USER",
          isAdmin: true,
          isAuth: true,
        },
      ]);
    }
  })
  .catch((err) => console.error("Ошибка синхронизации базы данных: ", err));

module.exports = {
  sequelize,
  Users,
  Schedule,
  Progress,
  Courses,
  ThemesOfCourses,
};
// const SurveyTopics = sequelize.define(
//   "survey_topics",
//   {
//     id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//     themes: { type: DataTypes.STRING, allowNull: false },
//   },
//   { timestamps: false }
// );

// const Schedule = sequelize.define(
//   "schedule",
//   {
//     id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//     chat_id: { type: DataTypes.BIGINT, allowNull: true },
//     themes_id: { type: DataTypes.INTEGER, allowNull: true },
//     date: { type: DataTypes.DATEONLY, allowNull: false },
//     time: { type: DataTypes.TIME, allowNull: false },
//   },
//   { timestamps: false }
// );

// const Progress = sequelize.define(
//   "progress",
//   {
//     id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//     chat_id: { type: DataTypes.BIGINT, allowNull: false },
//     themes_id: { type: DataTypes.INTEGER, allowNull: false },
//     status: { type: DataTypes.INTEGER, defaultValue: 0 },
//   },
//   { timestamps: false }
// );
