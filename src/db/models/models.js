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

const Users = sequelize.define(
  "users",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    chat_id: { type: DataTypes.BIGINT, unique: true, allowNull: false },
    fio: { type: DataTypes.STRING, allowNull: false },
    isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false },
    isAuth: { type: DataTypes.BOOLEAN, defaultValue: false },
    isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { timestamps: false }
);

const Courses = sequelize.define(
  "courses",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    admin_id: { type: DataTypes.BIGINT, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
  },
  { timestamps: false }
);

const FeedBackOfCourse = sequelize.define(
  "feedback_of_course",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    course_id: { type: DataTypes.BIGINT, allowNull: false },
    feedback: { type: DataTypes.STRING, allowNull: false },
  },
  { timestamps: false }
);

const CoursesOfUsers = sequelize.define(
  "courses_of_users",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.BIGINT, allowNull: false },
    course_id: { type: DataTypes.BIGINT, allowNull: false },
    auth_in_course: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { timestamps: false, primaryKey: ["user_id", "course_id"] }
);

const ThemesOfCourses = sequelize.define(
  "themes_of_courses",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    course_id: { type: DataTypes.BIGINT, allowNull: false },
  },
  { timestamps: false }
);

const QuestionsOfThemes = sequelize.define(
  "questions_of_themes",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    theme_id: { type: DataTypes.BIGINT, allowNull: false },
  },
  { timestamps: false }
);

const Schedule = sequelize.define(
  "schedule",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.BIGINT, allowNull: false },
    theme_id: { type: DataTypes.BIGINT, allowNull: false },
    course_id: { type: DataTypes.BIGINT, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    time: { type: DataTypes.TIME, allowNull: false },
  },
  { timestamps: false }
);

const Progress = sequelize.define(
  "progress",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.BIGINT, allowNull: false },
    theme_id: { type: DataTypes.BIGINT, allowNull: false },
    status: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  { timestamps: false }
);

// Установка связей между таблицами (не изменены, но ключи теперь BIGINT)
Courses.belongsTo(Users, { foreignKey: "admin_id", as: "admin" });
Users.hasMany(Courses, { foreignKey: "admin_id", as: "adminCourses" });
FeedBackOfCourse.belongsTo(Courses, { foreignKey: "course_id" });
Courses.hasMany(FeedBackOfCourse, { foreignKey: "course_id" });
Users.belongsToMany(Courses, {
  through: CoursesOfUsers,
  foreignKey: "user_id",
  otherKey: "course_id",
  as: "courses",
});
Courses.belongsToMany(Users, {
  through: CoursesOfUsers,
  foreignKey: "course_id",
  otherKey: "user_id",
  as: "users",
});
ThemesOfCourses.belongsTo(Courses, { foreignKey: "course_id" });
Courses.hasMany(ThemesOfCourses, { foreignKey: "course_id" });
QuestionsOfThemes.belongsTo(ThemesOfCourses, { foreignKey: "theme_id" });
ThemesOfCourses.hasMany(QuestionsOfThemes, { foreignKey: "theme_id" });
Schedule.belongsTo(Users, { foreignKey: "user_id" });
Users.hasMany(Schedule, { foreignKey: "user_id" });
Schedule.belongsTo(ThemesOfCourses, { foreignKey: "theme_id" });
ThemesOfCourses.hasMany(Schedule, { foreignKey: "theme_id" });
Schedule.belongsTo(Courses, { foreignKey: "course_id" });
Courses.hasMany(Schedule, { foreignKey: "course_id" });
Progress.belongsTo(Users, { foreignKey: "user_id" });
Users.hasMany(Progress, { foreignKey: "user_id" });
Progress.belongsTo(ThemesOfCourses, { foreignKey: "theme_id" });
ThemesOfCourses.hasMany(Progress, { foreignKey: "theme_id" });
CoursesOfUsers.belongsTo(Users, {
  foreignKey: "user_id",
  as: "user",
});
Users.hasMany(CoursesOfUsers, {
  foreignKey: "user_id",
});

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
  CoursesOfUsers,
  FeedBackOfCourse,
  QuestionsOfThemes,
};
