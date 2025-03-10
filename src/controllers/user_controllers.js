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

const getAllUsers = async (req, res) => {
  try {
    const result = await Users.findAll({
      attributes: ["id", "chat_id", "fio", "isAdmin", "isAuth"],
      where: { id: { [Op.ne]: 1 } },
    });
    if (result === null || result.length === 0) {
      return res.status(404).json({ message: "users is null" });
    } else {
      return res.status(200).json({ result });
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
    if (result === null || result.length === 0 || result.length === 0) {
      return res.status(404).json({ message: "users is null" });
    } else {
      return res.status(200).json({ result });
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

const checkAuthUser = async (req, res) => {
  const { chat_id } = req.body;

  try {
    if (chat_id === null) {
      return res.status(404).json({ message: "body is null" });
    } else {
      const result = await findUserByChatId(chat_id);
      if (!result.isAuth) {
        return res.status(405).json({ message: "Пользователь не авторизован" });
      } else {
        return res.status(200).json({ result });
      }
    }
  } catch (error) {
    console.error(
      "Ошибка при выполнение запроса авторизации пользователя",
      error
    );
    return res
      .status(500)
      .json({ message: "Ошибка при авторизации пользователя", error });
  }
};

const updateUser = async (req, res) => {
  const { id, fio, isAdmin, isAuth, isDeleted } = req.body;

  try {
    if (id === 1) {
      return res.status(404).json({ message: "wrong body" });
    } else {
      const [result] = await Users.update(
        { fio, isAdmin, isAuth, isDeleted },
        { where: { id } }
      );
      if (result === 0) {
        console.error(
          "Ошибка при выполнение запроса на обновление данных пользователя (res null)",
          error
        );
        return res
          .status(405)
          .json({ message: "Ошибка при обновление данных о пользователе" });
      } else {
        return res.status(200).json({ result });
      }
    }
  } catch (error) {
    console.error(
      "Ошибка при выполнение запроса на обновление данных пользователя",
      error
    );
    return res.status(500).json({
      message:
        "Ошибка при выполнение запроса на обновление данных пользователя",
      error,
    });
  }
};

module.exports = {
  getAllUsers,
  checkAuthUser,
  updateUser,
  getAllUsersIsDelete,
};
