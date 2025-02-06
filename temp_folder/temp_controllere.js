const {
  createUserM,
  findUserByChatIdM,
  getAllUserM,
  getAllScheduleM,
  getFreeScheduleM,
  addFreeScheduleM,
  deleteScheduleM,
} = require("../db/models/models");

try {
  // Проверка подключения
  await sequelize.authenticate();
  console.log("Соединение с базой данных установлено.");

  // Синхронизация моделей
  await sequelize.sync({ alter: true });
  console.log("Все таблицы синхронизированы.");
} catch (error) {
  console.error("Ошибка при инициализации базы данных через Sequelize:", error);
}

const getAllUsers = async (req, res) => {
  try {
    const result = await getAllUserM();
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при выполнение запроса", error });
  }
};

const registerUserBot = async (chat_id, fio) => {
  try {
    const result = await createUserM(chat_id, fio);
    if (result) {
      return 200;
    }
    return 200;
  } catch (error) {
    return 500;
  }
};

const checkStart = async (chat_id) => {
  try {
    const result = await findUserByChatIdM(chat_id);
    if (result) {
      return 201;
    }
    return 200;
  } catch (error) {
    return 200;
  }
};

const getAllSchedules = async (req, res) => {
  try {
    const result = await getAllScheduleM();
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при выполнение запроса", error });
  }
};

const checkAuthUser = async (req, res) => {
  const { chat_id } = req.body;

  try {
    const result = await findUserByChatIdM(chat_id);
    if (!result.isauth) {
      return res.status(400).json({ message: "Пользователь не авторизован" });
    } else {
      res.status(201).json({ result });
    }
  } catch (error) {
    res.status(500).json({ message: "Ошибка при выполнение запроса", error });
  }
};

const getFreeSchedule = async (req, res) => {
  try {
    const result = await getFreeScheduleM();

    if (result === null) {
      return res.status(400).json({ message: "Расписание пусто" });
    } else {
      res.status(201).json({ result });
    }
  } catch (error) {
    res.status(500).json({ message: "Ошибка при выполнение запроса", error });
  }
};

const addFreeSchedule = async (req, res) => {
  const { date, time } = req.body;
  try {
    const result = await addFreeScheduleM(null, null, date, time);

    if (result === null) {
      return res
        .status(400)
        .json({ message: "Ошибка при добавления расписания" });
    } else {
      res.status(201).json({ result });
    }
  } catch (error) {
    res.status(500).json({ message: "Ошибка при выполнение запроса", error });
  }
};

const deleteSchedule = async (req, res) => {
  const { id } = req.body;
  try {
    const result = await deleteScheduleM(id);

    if (result === null) {
      return res
        .status(400)
        .json({ message: "Ошибка при удалении расписания" });
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
};
