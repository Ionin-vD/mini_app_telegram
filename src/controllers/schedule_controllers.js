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

const addFreeSchedule = async (req, res) => {
  const { date, time, course_id } = req.body;
  try {
    if (date === null && time === null && course_id === null) {
      return res.status(501).json({ message: "body is null" });
    } else {
      const result = await Schedule.create({
        user_id: null,
        theme_id: null,
        course_id: course_id,
        date: date,
        time: time,
      });
      if (result === null) {
        console.error(
          "Ошибка при выполнение запроса на добавление свободного расписания (res null)",
          error
        );
        return res
          .status(501)
          .json({ message: "Ошибка при добавление свободного расписания" });
      } else {
        return res.status(200).json({ result });
      }
    }
  } catch (error) {
    console.error("Ошибка при добавление свободного расписания", error);
    res.status(500).json({ message: "Ошибка при выполнение запроса", error });
    throw error;
  }
};

const deleteSchedule = async (req, res) => {
  const { id } = req.body;
  try {
    if (id === null) {
      return res.status(501).json({ message: "body is null" });
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
          .status(501)
          .json({ message: "Ошибка при удалении расписания" });
      } else {
        return res.status(200).json({ result });
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
      return res.status(501).json({ message: "schedules is null" });
    } else {
      return res.status(200).json({ result });
    }
  } catch (error) {
    console.error(
      "Ошибка при выполнение запроса на получение всего расписания",
      error
    );
    res.status(500).json({
      message: "Ошибка при получение всего расписания",
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
      return res.status(501).json({ message: "free schedules is null" });
    } else {
      return res.status(200).json({ result });
    }
  } catch (error) {
    console.error(
      "Ошибка при выполнение запроса на получение всего расписания",
      error
    );
    res.status(500).json({
      message: "Ошибка при получение всего расписания",
      error,
    });
    throw error;
  }
};

const getAllScheduleIsCourse = async (req, res) => {
  const { course_id } = req.body;
  try {
    const result = await Schedule.findAll({
      where: { course_id: course_id },
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
      return res.status(501).json({ message: "free schedules is null" });
    } else {
      return res.status(200).json({ result });
    }
  } catch (error) {
    console.error(
      "Ошибка при выполнение запроса на получение всего расписания",
      error
    );
    res.status(500).json({
      message: "Ошибка при получение всего расписания",
      error,
    });
    throw error;
  }
};

module.exports = {
  getAllSchedules,
  getFreeSchedule,
  addFreeSchedule,
  deleteSchedule,
  getAllScheduleIsCourse,
};
