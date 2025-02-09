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
    console.error(
      "Ошибка при выполнение запроса авторизации пользователя",
      error
    );
    res
      .status(500)
      .json({ message: "Ошибка при авторизации пользователя", error });
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

module.exports = {
  createUser,
  getAllUsers,
  checkAuthUser,
  updateUser,
  getAllUsersIsDelete,
};
