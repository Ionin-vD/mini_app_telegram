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

module.exports = {
  registerUserBot,
  checkStart,
  findUserByChatId,
  createUser,
};
