const { Sequelize, DataTypes } = require("sequelize");
//require("dotenv").config({ path: ".env" });

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialect: "postgres",
//     logging: false,
//   }
// );
const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: "postgres",
    logging: false,
  }
);

const Users = sequelize.define(
  "users",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    chat_id: {
      type: DataTypes.BIGINT,
      unique: true,
      allowNull: false,
      index: true,
    },
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

const CoursesOfUsers = sequelize.define(
  "courses_of_users",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.BIGINT, allowNull: false, index: true },
    course_id: { type: DataTypes.BIGINT, allowNull: false, index: true },
    auth_in_course: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    timestamps: false,
    indexes: [{ unique: true, fields: ["user_id", "course_id"] }],
  }
);

Users.belongsToMany(Courses, {
  through: CoursesOfUsers,
  foreignKey: "user_id",
  otherKey: "course_id",
  as: "courses",
  onDelete: "CASCADE",
});
Courses.belongsToMany(Users, {
  through: CoursesOfUsers,
  foreignKey: "course_id",
  otherKey: "user_id",
  as: "users",
  onDelete: "CASCADE",
});

Courses.belongsTo(Users, {
  foreignKey: "admin_id",
  as: "admin",
  onDelete: "CASCADE",
});
Users.hasMany(Courses, {
  foreignKey: "admin_id",
  as: "adminCourses",
  onDelete: "CASCADE",
});

CoursesOfUsers.belongsTo(Users, {
  foreignKey: "user_id",
  as: "user",
  onDelete: "CASCADE",
});
Users.hasMany(CoursesOfUsers, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});

const FeedBackOfCourse = sequelize.define(
  "feedback_of_course",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    course_id: { type: DataTypes.BIGINT, allowNull: false },
    user_id: { type: DataTypes.BIGINT, allowNull: false },
    feedback: { type: DataTypes.STRING, allowNull: false },
  },
  { timestamps: false }
);

FeedBackOfCourse.belongsTo(Users, {
  foreignKey: "user_id",
  onDelete: "SET NULL",
});
Users.hasMany(FeedBackOfCourse, {
  foreignKey: "user_id",
  onDelete: "SET NULL",
});

FeedBackOfCourse.belongsTo(Courses, {
  foreignKey: "course_id",
  onDelete: "SET NULL",
});
Courses.hasMany(FeedBackOfCourse, {
  foreignKey: "course_id",
  onDelete: "SET NULL",
});

const ThemesOfCourses = sequelize.define(
  "themes_of_courses",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    course_id: { type: DataTypes.BIGINT, allowNull: false },
  },
  {
    timestamps: false,
    indexes: [{ unique: true, fields: ["title", "course_id"] }],
  }
);

ThemesOfCourses.belongsTo(Courses, {
  foreignKey: "course_id",
  onDelete: "CASCADE",
});
Courses.hasMany(ThemesOfCourses, {
  foreignKey: "course_id",
  onDelete: "CASCADE",
});

const QuestionsOfThemes = sequelize.define(
  "questions_of_themes",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    theme_id: { type: DataTypes.BIGINT, allowNull: false },
  },
  { timestamps: false }
);

QuestionsOfThemes.belongsTo(ThemesOfCourses, {
  foreignKey: "theme_id",
  onDelete: "CASCADE",
});
ThemesOfCourses.hasMany(QuestionsOfThemes, {
  foreignKey: "theme_id",
  onDelete: "CASCADE",
});

const Schedule = sequelize.define(
  "schedule",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.BIGINT, allowNull: true },
    theme_id: { type: DataTypes.BIGINT, allowNull: true },
    course_id: { type: DataTypes.BIGINT, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    time: { type: DataTypes.TIME, allowNull: false },
  },
  { timestamps: false }
);

Schedule.belongsTo(Users, { foreignKey: "user_id", onDelete: "CASCADE" });
Users.hasMany(Schedule, { foreignKey: "user_id", onDelete: "CASCADE" });

Schedule.belongsTo(ThemesOfCourses, {
  foreignKey: "theme_id",
  onDelete: "CASCADE",
});
ThemesOfCourses.hasMany(Schedule, {
  foreignKey: "theme_id",
  onDelete: "CASCADE",
});

Schedule.belongsTo(Courses, { foreignKey: "course_id", onDelete: "CASCADE" });
Courses.hasMany(Schedule, { foreignKey: "course_id", onDelete: "CASCADE" });

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

Progress.belongsTo(Users, { foreignKey: "user_id", onDelete: "CASCADE" });
Users.hasMany(Progress, { foreignKey: "user_id", onDelete: "CASCADE" });

Progress.belongsTo(ThemesOfCourses, {
  foreignKey: "theme_id",
  onDelete: "CASCADE",
});
ThemesOfCourses.hasMany(Progress, {
  foreignKey: "theme_id",
  onDelete: "CASCADE",
});

sequelize
  .sync({ force: true })
  .then(async () => {
    await Users.findOrCreate({
      where: { chat_id: process.env.CHAT_ID },
      defaults: {
        fio: "SUPER USER",
        isAdmin: true,
        isAuth: true,
      },
    });
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
