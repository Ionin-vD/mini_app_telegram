const {
  sequelize,
  Users,
  Schedule,
  Progress,
  ThemesOfCourses,
  Courses,
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
      res.status(100).json({ message: "courses is null" });
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
      return res.status(201).json({ message: "wrong body" });
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
        return res.status(500).json({ message: "Ошибка при добавления курса" });
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

module.exports = {
  addCourse,
  getAllCourse,
};
