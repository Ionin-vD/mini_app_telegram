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

const createUser = async (chat_id, fio) => {
  try {
    const result = await UserData.create({
      chat_id,
      fio,
      isAdmin: false,
      isAuth: true,
      isDeleted: false,
    });
    return result;
  } catch (error) {
    console.error("Ошибка при создании пользователя:", error);
    throw error;
  }
};

const findUserByChatId = async (chat_id) => {
  try {
    const result = await UserData.findOne({
      where: { chat_id },
      attributes: ["id", "fio", "isAdmin", "isAuth"],
    });
    return result;
  } catch (error) {
    console.error("Ошибка при выполнение запроса", error);
    throw error;
  }
};

const getAllUsers = async (req, res) => {
  try {
    const result = await UserData.findAll({
      attributes: ["id", "fio", "isAdmin", "isAuth"],
    });
    res.status(200).json({ result });
  } catch (error) {
    console.error("Ошибка при выполнение запроса", error);
    res.status(500).json({ message: "Ошибка при выполнение запроса", error });
    throw error;
  }
};

const getAllUsersIsDelete = async (req, res) => {
  try {
    const result = await UserData.findAll({
      attributes: ["id", "fio", "isAdmin", "isAuth", "isDeleted"],
    });
    res.status(200).json({ result });
  } catch (error) {
    console.error("Ошибка при выполнение запроса", error);
    res.status(500).json({ message: "Ошибка при выполнение запроса", error });
    throw error;
  }
};

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
    console.error("Ошибка при выполнение запроса", error);
    res.status(500).json({ message: "Ошибка при выполнение запроса", error });
    throw error;
  }
};

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
      console.error("Ошибка при выполнение запроса", error);
      return res.status(500).json({ message: "Расписание пусто" });
    } else {
      res.status(200).json({ result });
    }
  } catch (error) {
    console.error("Ошибка при выполнение запроса", error);
    res.status(500).json({ message: "Ошибка при выполнение запроса", error });
    throw error;
  }
};

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
      console.error("Ошибка при выполнение запроса", error);
      return res
        .status(500)
        .json({ message: "Ошибка при добавления расписания" });
    } else {
      res.status(200).json({ result });
    }
  } catch (error) {
    console.error("Ошибка при выполнение запроса", error);
    res.status(500).json({ message: "Ошибка при выполнение запроса", error });
    throw error;
  }
};

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
      console.error("Ошибка при выполнение запроса", error);
      return res
        .status(500)
        .json({ message: "Ошибка при удалении расписания" });
    } else {
      res.status(200).json({ result });
    }
  } catch (error) {
    console.error("Ошибка при выполнение запроса", error);
    res.status(500).json({ message: "Ошибка при выполнение запроса", error });
    throw error;
  }
};

const checkAuthUser = async (req, res) => {
  const { chat_id } = req.body;

  try {
    const result = await findUserByChatId(chat_id);
    if (!result.isAuth) {
      console.error("Ошибка при выполнение запроса", error);
      return res.status(500).json({ message: "Пользователь не авторизован" });
    } else {
      res.status(200).json({ result });
    }
  } catch (error) {
    console.error("Ошибка при выполнение запроса", error);
    res.status(500).json({ message: "Ошибка при выполнение запроса", error });
  }
};

const updateUser = async (req, res) => {
  const { chat_id, fio, isAdmin, isAuth, isDeleted } = req.body;

  try {
    const user = await UserData.findOne({
      where: { chat_id },
      attributes: ["id", "fio", "isAdmin", "isAuth", "isDeleted"],
    });
    user.fio = fio;
    user.isAdmin = isAdmin;
    user.isAuth = isAuth;
    user.isDeleted = isDeleted;

    const result = await user.save();
    if (result === null) {
      console.error("Ошибка при выполнение запроса", error);
      res.status(500).json({ message: "Ошибка при выполнение запроса" });
    } else {
      res.status(200).json({ result });
    }
  } catch (error) {
    console.error("Ошибка при выполнение запроса", error);
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
  updateUser,
  getAllUsersIsDelete,
};
