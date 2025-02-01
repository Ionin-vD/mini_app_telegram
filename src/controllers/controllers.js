const {
  createUser,
  findUserByChatId,
  getAll,
} = require("../db/models/user_model");

const getAllUsers = async (req, res) => {
  try {
    const result = await getAll();
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

module.exports = { registerUserBot, checkStart, getAllUsers };
