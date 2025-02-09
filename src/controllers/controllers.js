const {
  sequelize,
  Users,
  Schedule,
  Progress,
  ThemesOfCourses,
  Courses,
} = require("../db/models/models");
const { Op } = require("sequelize");

const checkStart = async (chat_id) => {
  try {
    const result = await findUserByChatId(chat_id);
    if (result) {
      return 201;
    }
    return 200;
  } catch (error) {
    return 200;
  }
};

const registerUserBot = async (chat_id, fio) => {
  try {
    const result = await createUser(chat_id, fio);
    if (result) {
      return 200;
    }
    return 200;
  } catch (error) {
    return 500;
  }
};

const createUser = async (chat_id, fio) => {
  try {
    const result = await Users.create({
      chat_id,
      fio,
      isAdmin: false,
      isAuth: true,
      isDeleted: false,
    });
    return result;
  } catch (error) {
    console.error("Ошибка при создании пользователя: (снаружи)", error);
    throw error;
  }
};

const findUserByChatId = async (chat_id) => {
  try {
    const result = await Users.findOne({
      where: { chat_id },
      attributes: ["id", "fio", "isAdmin", "isAuth"],
    });
    return result;
  } catch (error) {
    console.error("Ошибка при поиске пользователя по chat_id (снаружи)", error);
    throw error;
  }
};

const getAllUsers = async (req, res) => {
  try {
    const result = await Users.findAll({
      attributes: ["id", "chat_id", "fio", "isAdmin", "isAuth"],
      where: { id: { [Op.ne]: 1 } },
    });
    if (result === null) {
      res.status(100).json({ message: "users is null" });
    } else {
      res.status(200).json({ result });
    }
  } catch (error) {
    console.error(
      "Ошибка при выполнение запроса на получение всех пользователей",
      error
    );
    res.status(500).json({
      message: "Ошибка при получение всех пользователей",
      error,
    });
    throw error;
  }
};

const getAllUsersIsDelete = async (req, res) => {
  try {
    const result = await Users.findAll({
      attributes: ["id", "chat_id", "fio", "isAdmin", "isAuth", "isDeleted"],
      where: { id: { [Op.ne]: 1 } },
    });
    if (result === null) {
      res.status(100).json({ message: "users is null" });
    } else {
      res.status(200).json({ result });
    }
  } catch (error) {
    console.error(
      "Ошибка при выполнение запроса на получение всех пользователей (снаружи)",
      error
    );
    res.status(500).json({
      message: "Ошибка при получение всех пользователей",
      error,
    });
    throw error;
  }
};

const getAllSchedules = async (req, res) => {
  try {
    const result = await Schedule.findAll({
      include: [
        {
          model: Users,
          attributes: ["fio"],
        },
        {
          model: ThemesOfCourses,
          attributes: ["title"],
        },
      ],
    });
    if (result === null) {
      res.status(100).json({ message: "schedules is null" });
    } else {
      res.status(200).json({ result });
    }
  } catch (error) {
    console.error(
      "Ошибка при выполнение запроса на получение всего расписания (снаружи)",
      error
    );
    res.status(500).json({
      message: "Ошибка при выполнение запроса на получение всего расписания",
      error,
    });
    throw error;
  }
};

const getFreeSchedule = async (req, res) => {
  try {
    const result = await Schedule.findAll({
      where: { user_id: null },
      include: [
        {
          model: Users,
          attributes: ["fio"],
        },
        {
          model: ThemesOfCourses,
          attributes: ["title"],
        },
      ],
    });
    if (result === null) {
      res.status(100).json({ message: "free schedules is null" });
    } else {
      res.status(200).json({ result });
    }
  } catch (error) {
    console.error(
      "Ошибка при выполнение запроса на получение всего расписания (снаружи)",
      error
    );
    res.status(500).json({
      message: "Ошибка при выполнение запроса на получение всего расписания",
      error,
    });
    throw error;
  }
};

const getAllCourse = async (req, res) => {
  try {
    const result = await Courses.findAll();
    if (result === null) {
      res.status(100).json({ message: "courses is null" });
    } else {
      res.status(200).json({ result });
    }
  } catch (error) {
    console.error("Ошибка при выполнение запроса (снаружи)", error);
    res.status(500).json({ message: "Ошибка при выполнение запроса", error });
  }
};

const checkAuthUser = async (req, res) => {
  const { chat_id } = req.body;

  try {
    if (chat_id === null) {
      return res.status(201).json({ message: "body is null" });
    } else {
      const result = await findUserByChatId(chat_id);
      if (!result.isAuth) {
        return res.status(200).json({ message: "Пользователь не авторизован" });
      } else {
        res.status(200).json({ result });
      }
    }
  } catch (error) {
    console.error("Ошибка при выполнение запроса (снаружи)", error);
    res.status(500).json({ message: "Ошибка при выполнение запроса", error });
  }
};

const addFreeSchedule = async (req, res) => {
  const { date, time, course_id } = req.body;
  try {
    if (date === null || date === time || course_id === null) {
      return res.status(201).json({ message: "body is null" });
    } else {
      const result = await Schedule.create({
        user_id: null,
        theme_id: null,
        course_id: course_id,
        date: date,
        time: time,
      });
      if (result === null) {
        console.error("Ошибка при выполнение запроса (внутри)", error);
        return res
          .status(500)
          .json({ message: "Ошибка при добавления расписания" });
      } else {
        res.status(200).json({ result });
      }
    }
  } catch (error) {
    console.error("Ошибка при выполнение запроса (снаружи)", error);
    res.status(500).json({ message: "Ошибка при выполнение запроса", error });
    throw error;
  }
};

const deleteSchedule = async (req, res) => {
  const { id } = req.body;
  try {
    if (id === null) {
      return res.status(201).json({ message: "body is null" });
    } else {
      const result = await Schedule.destroy({
        where: {
          id: id,
          user_id: null,
        },
      });
      if (result === null) {
        console.error(
          "Ошибка при выполнение запроса на удаление расписания (res null)",
          error
        );
        return res
          .status(500)
          .json({ message: "Ошибка при удалении расписания" });
      } else {
        res.status(200).json({ result });
      }
    }
  } catch (error) {
    console.error(
      "Ошибка при выполнение запроса на удаление расписания",
      error
    );
    res.status(500).json({ message: "Ошибка при удаление расписания", error });
    throw error;
  }
};

const updateUser = async (req, res) => {
  const { id, fio, isAdmin, isAuth, isDeleted } = req.body;

  try {
    if (id === 1) {
      return res.status(201).json({ message: "wrong body" });
    } else {
      const user = await Users.findOne({
        where: { id },
        attributes: ["id", "fio", "isAdmin", "isAuth", "isDeleted"],
      });
      user.fio = fio;
      user.isAdmin = isAdmin;
      user.isAuth = isAuth;
      user.isDeleted = isDeleted;

      const result = await user.save();
      if (result === null) {
        console.error(
          "Ошибка при выполнение запроса на обновление данных пользователя (res null)",
          error
        );
        res
          .status(500)
          .json({ message: "Ошибка при обновление данных о пользователе" });
      } else {
        res.status(200).json({ result });
      }
    }
  } catch (error) {
    console.error(
      "Ошибка при выполнение запроса на обновление данных пользователя",
      error
    );
    res.status(500).json({
      message:
        "Ошибка при выполнение запроса на обновление данных пользователя",
      error,
    });
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
  registerUserBot,
  checkStart,
  getAllUsers,
  getAllSchedules,
  checkAuthUser,
  getFreeSchedule,
  addFreeSchedule,
  deleteSchedule,
  findUserByChatId,
  updateUser,
  getAllUsersIsDelete,
  addCourse,
  getAllCourse,
};
