const {
  sequelize,
  UserData,
  SurveyTopics,
  Schedule,
  Progress,
} = require("../db/models/models");

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

// Создание пользователя
const createUser = async (chat_id, fio) => {
  try {
    const user = await UserData.create({
      chat_id,
      fio,
      isAdmin: false,
      isAuth: false,
      isDeleted: false,
    });
    return user;
  } catch (error) {
    console.error("Ошибка при создании пользователя:", error);
    throw error;
  }
};

// Поиск пользователя по chat_id
const findUserByChatId = async (chat_id) => {
  try {
    const user = await UserData.findOne({
      where: { chat_id },
      attributes: ["id", "fio", "isAdmin", "isAuth"],
    });
    return user;
  } catch (error) {
    console.error("Ошибка при поиске пользователя по chat_id:", error);
    throw error;
  }
};

// Получение всех пользователей
const getAllUsers = async (req, res) => {
  try {
    const result = await UserData.findAll({
      attributes: ["id", "fio", "isAdmin", "isAuth"],
    });
    res.status(200).json({ result });
  } catch (error) {
    console.error("Ошибка при получении всех пользователей:", error);
    res
      .status(500)
      .json({ message: "Ошибка при получении всех пользователей:", error });
    throw error;
  }
};

// Получение всех расписаний с пользователями и темами
const getAllSchedules = async (req, res) => {
  try {
    const result = await Schedule.findAll({
      include: [
        {
          model: UserData,
          attributes: ["fio"],
        },
        {
          model: SurveyTopics,
          attributes: ["themes"],
        },
      ],
    });
    res.status(200).json({ result });
  } catch (error) {
    console.error("Ошибка при получении всех расписаний:", error);
    res
      .status(500)
      .json({ message: "Ошибка при получении всех расписаний:", error });
    throw error;
  }
};

// Получение свободных расписаний
const getFreeSchedule = async () => {
  try {
    const result = await Schedule.findAll({
      where: { chat_id: null },
      include: [
        {
          model: UserData,
          attributes: ["fio"],
        },
        {
          model: SurveyTopics,
          attributes: ["themes"],
        },
      ],
    });
    if (result === null) {
      return res.status(400).json({ message: "Расписание пусто" });
    } else {
      res.status(201).json({ result });
    }
  } catch (error) {
    console.error("Ошибка при получении свободных расписаний:", error);
    throw error;
  }
};

// Добавление свободного расписания
const addFreeSchedule = async (req, res) => {
  const { date, time } = req.body;
  try {
    const result = await Schedule.create({
      chat_id: null,
      themes_id: null,
      date: date,
      time: time,
    });
    if (result === null) {
      return res
        .status(400)
        .json({ message: "Ошибка при добавления расписания" });
    } else {
      res.status(201).json({ result });
    }
  } catch (error) {
    console.error("Ошибка при добавлении свободного расписания:", error);
    throw error;
  }
};

// Удаление расписания
const deleteSchedule = async (req, res) => {
  const { id } = req.body;
  try {
    const result = await Schedule.destroy({
      where: {
        id: id,
        chat_id: null,
      },
    });
    if (result === null) {
      return res
        .status(400)
        .json({ message: "Ошибка при удалении расписания" });
    } else {
      res.status(201).json({ result });
    }
  } catch (error) {
    console.error("Ошибка при удалении расписания:", error);
    throw error;
  }
};

const checkAuthUser = async (req, res) => {
  const { chat_id } = req.body;

  try {
    const result = await findUserByChatId(chat_id);
    if (!result.isAuth) {
      return res.status(400).json({ message: "Пользователь не авторизован" });
    } else {
      res.status(201).json({ result });
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
  getFreeSchedule,
  addFreeSchedule,
  deleteSchedule,
  findUserByChatId,
};
