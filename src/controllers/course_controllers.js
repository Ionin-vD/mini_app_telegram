const {
  sequelize,
  Users,
  Schedule,
  Progress,
  ThemesOfCourses,
  Courses,
  CoursesOfUsers,
} = require("../db/models/models");
const { Op } = require("sequelize");

const {
  registerUserBot,
  checkStart,
  findUserByChatId,
} = require("./controllers");

const getAllCourse = async (req, res) => {
  try {
    const result = await Courses.findAll({
      attributes: ["id", "admin_id", "title"],
      include: [
        {
          model: Users,
          as: "admin",
          attributes: ["fio"],
        },
      ],
    });
    if (result === null) {
      res.status(501).json({ message: "courses is null" });
    } else {
      res.status(200).json({ result });
    }
  } catch (error) {
    console.error(
      "Ошибка при выполнение запроса на получение всех курсов",
      error
    );
    res
      .status(500)
      .json({ message: "Ошибка при получение всех курсов", error });
  }
};

const addCourse = async (req, res) => {
  const { id, title } = req.body;

  try {
    if (id === 1) {
      return res.status(501).json({ message: "wrong body" });
    } else {
      const result = await Courses.create({
        admin_id: id,
        title: title,
      });
      if (result === null) {
        console.error(
          "Ошибка при выполнение запроса при добавления курса (res null)",
          error
        );
        return res.status(501).json({ message: "Ошибка при добавления курса" });
      } else {
        res.status(200).json({ result });
      }
    }
  } catch (error) {
    console.error("Ошибка при выполнение запроса на добавление курса", error);
    res.status(500).json({
      message: "Ошибка при выполнение запроса на добавление курса",
      error,
    });
  }
};

const updateTitleCourse = async (req, res) => {
  const { id, admin_id, title } = req.body;

  try {
    const course = await Courses.findOne({
      where: { id, admin_id },
      attributes: ["id", "title"],
    });
    course.title = title;

    const result = await course.save();
    if (result === null) {
      console.error(
        "Ошибка при выполнение запроса на обновление названия курса (res null)",
        error
      );
      res.status(501).json({ message: "Ошибка при обновление названия курса" });
    } else {
      res.status(200).json({ result });
    }
  } catch (error) {
    console.error(
      "Ошибка при выполнение запроса на обновление названия курса",
      error
    );
    res.status(500).json({
      message: "Ошибка при выполнение запроса на обновление названия курса",
      error,
    });
  }
};

const addUserInCourse = async (req, res) => {
  const { user_id, course_id } = req.body;

  try {
    const result = await CoursesOfUsers.create({
      user_id: user_id,
      course_id: course_id,
      auth_in_course: false,
    });
    if (result === null) {
      console.error(
        "Ошибка при выполнение запроса при добавления пользователя на курс (res null)",
        error
      );
      return res
        .status(501)
        .json({ message: "Ошибка при добавления пользователя на курс" });
    } else {
      res.status(200).json({ result });
    }
  } catch (error) {
    console.error(
      "Ошибка при выполнение запроса на добавления пользователя на курс",
      error
    );
    res.status(500).json({
      message:
        "Ошибка при выполнение запроса на добавления пользователя на курс",
      error,
    });
  }
};

module.exports = {
  addCourse,
  getAllCourse,
  updateTitleCourse,
  addUserInCourse,
};
