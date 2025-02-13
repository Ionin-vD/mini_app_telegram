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
      return res.status(501).json({ message: "courses is null" });
    } else {
      return res.status(200).json({ result });
    }
  } catch (error) {
    console.error(
      "Ошибка при выполнение запроса на получение всех курсов",
      error
    );
    res
      .status(500)
      .json({ message: "Ошибка при получение всех курсов", error });
    throw error;
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
        return res.status(200).json({ result });
      }
    }
  } catch (error) {
    console.error("Ошибка при выполнение запроса на добавление курса", error);
    res.status(500).json({
      message: "Ошибка при выполнение запроса на добавление курса",
      error,
    });
    throw error;
  }
};

const updateTitleCourse = async (req, res) => {
  const { id, admin_id, title } = req.body;

  try {
    const [result] = await Courses.update(
      { title },
      { where: { id, admin_id } }
    );
    if (result === 0) {
      console.error(
        "Ошибка при выполнение запроса на обновление названия курса (res null)",
        error
      );
      return res
        .status(501)
        .json({ message: "Ошибка при обновление названия курса" });
    } else {
      return res.status(200).json({ result });
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
    throw error;
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
      return res.status(200).json({ result });
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
    throw error;
  }
};

const addThemeInCourse = async (req, res) => {
  const { title, course_id } = req.body;

  try {
    const result = await ThemesOfCourses.create({
      title: title,
      course_id: course_id,
    });
    if (result === null) {
      console.error(
        "Ошибка при выполнение запроса при добавления темы на курс (res null)",
        error
      );
      return res
        .status(501)
        .json({ message: "Ошибка при добавления темы на курс" });
    } else {
      return res.status(200).json({ result });
    }
  } catch (error) {
    console.error(
      "Ошибка при выполнение запроса на добавления темы на курс",
      error
    );
    res.status(500).json({
      message: "Ошибка при выполнение запроса на добавления темы на курс",
      error,
    });
    throw error;
  }
};

const getAllThemesInCourses = async (req, res) => {
  const { course_id } = req.body;
  try {
    const result = await ThemesOfCourses.findAll({
      where: { course_id },
      attributes: ["id", "title", "course_id"],
      include: [
        {
          model: Courses,
          attributes: ["title"],
        },
      ],
    });
    if (result === null) {
      return res.status(501).json({ message: "themes is null" });
    } else {
      return res.status(200).json({ result });
    }
  } catch (error) {
    console.error(
      "Ошибка при выполнение запроса на получение всех тем на курсе",
      error
    );
    res
      .status(500)
      .json({ message: "Ошибка при получение всех тем на курсе", error });
    throw error;
  }
};

const getAllTUsersInCourses = async (req, res) => {
  const { course_id } = req.body;
  try {
    const result = await CoursesOfUsers.findAll({
      where: { course_id },
      attributes: ["id", "user_id", "course_id", "auth_in_course"],
      include: [
        {
          model: Users,
          as: "user",
          attributes: ["fio"],
        },
      ],
    });
    if (result === null) {
      return res.status(501).json({ message: "users is null" });
    } else {
      return res.status(200).json({ result });
    }
  } catch (error) {
    console.error(
      "Ошибка при выполнение запроса на получение всех юзеров на курсе",
      error
    );
    res
      .status(500)
      .json({ message: "Ошибка при получение всех юзеров на курсе", error });
    throw error;
  }
};

const updateThemeInCourse = async (req, res) => {
  const { id, title } = req.body;
  try {
    const [result] = await ThemesOfCourses.update({ title }, { where: { id } });
    if (result === 0) {
      console.error(
        "Ошибка при выполнение запроса на обновление данных темы (res null)",
        error
      );
      return res
        .status(501)
        .json({ message: "Ошибка при обновление данных о теме" });
    } else {
      return res.status(200).json({ result });
    }
  } catch (error) {
    console.error(
      "Ошибка при выполнение запроса на обновление данных о теме",
      error
    );
    res
      .status(500)
      .json({ message: "Ошибка на обновление данных о теме", error });
    throw error;
  }
};

const changeAuthUserInCourse = async (req, res) => {
  const { id, auth_in_course } = req.body;
  try {
    const [result] = await CoursesOfUsers.update(
      { auth_in_course },
      { where: { id } }
    );
    if (result === 0) {
      console.error(
        "Ошибка при выполнение запроса на обновление данных auth юзера в теме (res null)",
        error
      );
      return res
        .status(501)
        .json({ message: "Ошибка при обновление данных об auth юзера в теме" });
    } else {
      return res.status(200).json({ result });
    }
  } catch (error) {
    console.error(
      "Ошибка при выполнение запроса на обновление данных об auth юзера в теме",
      error
    );
    res.status(500).json({
      message: "Ошибка на обновление данных об auth юзера в теме",
      error,
    });
    throw error;
  }
};

module.exports = {
  addCourse,
  getAllCourse,
  updateTitleCourse,
  addUserInCourse,
  addThemeInCourse,
  getAllThemesInCourses,
  updateThemeInCourse,
  changeAuthUserInCourse,
  getAllTUsersInCourses,
};
