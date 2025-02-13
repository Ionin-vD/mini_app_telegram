const {
  sequelize,
  Users,
  Schedule,
  Progress,
  ThemesOfCourses,
  Courses,
  CoursesOfUsers,
  QuestionsOfThemes,
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
    const result = await Courses.update({ title }, { where: { id, admin_id } });
    if (result === null) {
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
          attributes: ["fio", "isAdmin", "isAuth"],
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
    const result = await ThemesOfCourses.update({ title }, { where: { id } });
    if (result === null) {
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
    res.status(500).json({
      message: "Ошибка при выполнение запроса на обновление данных о теме",
      error,
    });
    throw error;
  }
};

const changeAuthUserInCourse = async (req, res) => {
  const { id, auth_in_course } = req.body;
  try {
    const result = await CoursesOfUsers.update(
      { auth_in_course },
      { where: { id } }
    );
    if (result === null) {
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
      message:
        "Ошибка при выполнение запроса на обновление данных об auth юзера в теме",
      error,
    });
    throw error;
  }
};

const checkThemeIsBusy = async (req, res) => {
  const { id } = req.body;
  try {
    const relatedRecords = await Promise.all([
      QuestionsOfThemes.count({ where: { theme_id: id } }),
      Schedule.count({ where: { theme_id: id } }),
      Progress.count({ where: { theme_id: id } }),
    ]);

    const isBusy = relatedRecords.some((count) => count > 0);

    return res.status(200).json({ result: isBusy });
  } catch (error) {
    console.error("Ошибка при выполнение запроса на занятость темы", error);
    res.status(500).json({
      message: "Ошибка при выполнение запроса на занятость темы",
      error,
    });
    throw error;
  }
};

const deleteTheme = async (req, res) => {
  const { id } = req.body;
  try {
    await QuestionsOfThemes.destroy({ where: { theme_id: id } });
    await Schedule.destroy({ where: { theme_id: id } });
    await Progress.destroy({ where: { theme_id: id } });

    const result = await ThemesOfCourses.destroy({
      where: {
        id: id,
      },
    });

    return res.status(200).json({ result });
  } catch (error) {
    console.error("Ошибка при выполнение запроса на занятость темы", error);
    res.status(500).json({
      message: "Ошибка при выполнение запроса на занятость темы",
      error,
    });
    throw error;
  }
};

const getAllQuestionsOfThemes = async (req, res) => {
  const { id } = req.body;
  try {
    const result = await QuestionsOfThemes.findAll({
      where: { id },
      attributes: ["id", "title", "theme_id"],
      include: [
        {
          model: ThemesOfCourses,
          attributes: ["title"],
        },
      ],
    });
    if (result === null) {
      return res.status(501).json({ message: "question is null" });
    } else {
      return res.status(200).json({ result });
    }
  } catch (error) {
    console.error(
      "Ошибка при выполнение запроса на получение всех вопросов к теме",
      error
    );
    res
      .status(500)
      .json({ message: "Ошибка при получение всех вопросов к теме", error });
    throw error;
  }
};

const updateQuestionInTheme = async (req, res) => {
  const { id, title } = req.body;
  try {
    const result = await QuestionsOfThemes.update({ title }, { where: { id } });
    if (result === null) {
      console.error(
        "Ошибка при выполнение запроса на обновление данных вопроса (res null)",
        error
      );
      return res
        .status(501)
        .json({ message: "Ошибка при обновление данных о вопросе" });
    } else {
      return res.status(200).json({ result });
    }
  } catch (error) {
    console.error(
      "Ошибка при выполнение запроса на обновление данных о вопросе",
      error
    );
    res.status(500).json({
      message: "Ошибка при выполнение запроса на обновление данных о вопросе",
      error,
    });
    throw error;
  }
};

const deleteQuestion = async (req, res) => {
  const { id } = req.body;
  try {
    if (id === null) {
      return res.status(501).json({ message: "body is null" });
    } else {
      const result = await QuestionsOfThemes.destroy({
        where: {
          id: id,
        },
      });
      if (result === null) {
        console.error(
          "Ошибка при выполнение запроса на удаление вопроса (res null)",
          error
        );
        return res.status(501).json({ message: "Ошибка при удалении вопроса" });
      } else {
        return res.status(200).json({ result });
      }
    }
  } catch (error) {
    console.error("Ошибка при выполнение запроса на удаление вопроса", error);
    res.status(500).json({ message: "Ошибка при удаление вопроса", error });
    throw error;
  }
};

const addQuestionInTheme = async (req, res) => {
  const { title, theme_id } = req.body;

  if (!Array.isArray(title)) {
    return res.status(501).json({ message: "Поле title должно быть массивом" });
  }

  try {
    const createPromises = title.map(async (t) => {
      return await QuestionsOfThemes.create({
        title: t,
        theme_id: theme_id,
      });
    });

    const results = await Promise.all(createPromises);

    if (results.some((result) => result === null)) {
      console.error("Ошибка при создании некоторых вопросов");
      return res
        .status(501)
        .json({ message: "Ошибка при добавлении некоторых вопросов на тему" });
    } else {
      return res.status(200).json({ results });
    }
  } catch (error) {
    console.error(
      "Ошибка при выполнение запроса на добавления вопроса на тему",
      error
    );
    res.status(500).json({
      message: "Ошибка при выполнение запроса на добавления вопроса на тему",
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
  checkThemeIsBusy,
  deleteTheme,
  getAllQuestionsOfThemes,
  updateQuestionInTheme,
  deleteQuestion,
  addQuestionInTheme,
};
