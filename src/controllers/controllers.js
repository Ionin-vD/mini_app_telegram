const {
  createUser,
  findUserByChatId,
  getAllUser,
  getAllSchedule,
} = require("../db/models/models");

const getAllUsers = async (req, res) => {
  try {
    const result = await getAllUser();
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при выполнение запроса", error });
  }
};

const registerUserBot = async (chat_id, fio) => {
  try {
    const existingUser = await findUserByChatId(chat_id);
    if (existingUser) {
      return 201;
    }
    await createUser(chat_id, fio);
    return 200;
  } catch (error) {
    return 500;
  }
};

const checkStart = async (chat_id) => {
  try {
    const existingUser = await findUserByChatId(chat_id);
    if (existingUser) {
      return 201;
    }
    return 200;
  } catch (error) {
    return 500;
  }
};

const getAllSchedules = async (req, res) => {
  try {
    const result = await getAllSchedule();
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при выполнение запроса", error });
  }
};

const checkAuthUser = async (req, res) => {
  const { chat_id } = req.body;

  try {
    const existingUser = await findUserByChatId(chat_id);

    if (!existingUser.isauth) {
      return res.status(400).json({ message: "Пользователь не авторизован" });
    } else {
      res.status(201).json({ existingUser });
    }
  } catch (error) {
    res.status(500).json({ message: "Ошибка при выполнение запроса", error });
  }
};

module.exports = {
  registerUserBot,
  checkStart,
  getAllUsers,
  getAllSchedules,
  checkAuthUser,
};
