const moment = require("moment");
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
      return res.status(404).json({ message: "body is null" });
    } else {
      const existingRecord = await Schedule.findOne({
        where: {
          course_id: course_id,
          date: date,
          time: time,
        },
      });

      if (existingRecord) {
        return res
          .status(405)
          .json({ message: "Такое расписание уже существует" });
      }
      const result = await Schedule.create({
        user_id: null,
        theme_id: null,
        course_id: course_id,
        date: date,
        time: time,
      });
      if (result === null || result.length === 0) {
        console.error(
          "Ошибка при выполнение запроса на добавление свободного расписания (res null)",
          error
        );
        return res
          .status(405)
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

const addSchedule = async (req, res) => {
  const { date, time, course_id } = req.body;
  try {
    if (date === null && time === null && course_id === null) {
      return res.status(404).json({ message: "body is null" });
    } else {
      // Если дата уже в формате YYYY-MM-DD, оставляем её без изменений, иначе пытаемся преобразовать из DD.MM.YYYY
      let formattedDate;
      if (moment(date, "YYYY-MM-DD", true).isValid()) {
        formattedDate = date;
      } else {
        formattedDate = moment(date, "DD.MM.YYYY").format("YYYY-MM-DD");
        if (!moment(formattedDate, "YYYY-MM-DD", true).isValid()) {
          return res.status(400).json({ message: "Неверный формат даты" });
        }
      }

      // Разбиваем timeRange на начальное и конечное время
      const [startTime, endTime] = time.split("-");

      // Функция для преобразования времени в минуты
      const timeToMinutes = (timeStr) => {
        const [hours, minutes] = timeStr.split(":").map(Number);
        return hours * 60 + minutes;
      };

      // Функция для преобразования минут обратно в время
      const minutesToTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${String(hours).padStart(2, "0")}:${String(mins).padStart(
          2,
          "0"
        )}`;
      };

      const startMinutes = timeToMinutes(startTime);
      const endMinutes = timeToMinutes(endTime);
      const interval = 90; // Интервал в минутах (1.5 часа)

      // Генерация временных слотов
      const timeSlots = [];
      for (
        let current = startMinutes;
        current < endMinutes;
        current += interval
      ) {
        timeSlots.push(minutesToTime(current));
      }

      // Получаем уже существующие расписания для данного курса и даты
      const existingSchedules = await Schedule.findAll({
        where: {
          course_id: course_id,
          date: formattedDate,
        },
      });

      // Создание расписаний для каждого временного слота
      for (const slotTime of timeSlots) {
        const slotMinutes = timeToMinutes(slotTime);

        // Проверяем, нет ли конфликта с существующими расписаниями:
        // Если разница между новым временем и временем любого из существующих меньше интервала, отклоняем добавление
        const conflict = existingSchedules.find((schedule) => {
          const existingMinutes = timeToMinutes(schedule.time);
          return Math.abs(existingMinutes - slotMinutes) < interval;
        });
        if (conflict) {
          return res.status(405).json({
            message: `Невозможно добавить расписание на ${formattedDate} в ${slotTime}: конфликт с уже существующим расписанием в ${conflict.time}`,
          });
        }

        // Проверяем, существует ли уже запись точно для этого слота
        const existingRecord = await Schedule.findOne({
          where: {
            course_id: course_id,
            date: formattedDate,
            time: slotTime,
          },
        });
        if (existingRecord) {
          return res.status(405).json({
            message: `Расписание на ${formattedDate} в ${slotTime} уже существует`,
          });
        }

        const result = await Schedule.create({
          user_id: null,
          theme_id: null,
          course_id: course_id,
          date: formattedDate,
          time: slotTime,
        });

        if (result === null || result.length === 0) {
          console.error(
            "Ошибка при выполнении запроса на добавление расписания (res null)"
          );
          return res
            .status(405)
            .json({ message: "Ошибка при добавлении расписания" });
        }

        // Добавляем только что созданное расписание в список существующих, чтобы последующие проверки учитывали его
        existingSchedules.push(result);
      }
      return res.status(200).json({ message: "Расписание успешно добавлено" });
      //return res.status(200).json({ result });
    }
  } catch (error) {
    console.error("Ошибка при добавлении расписания", error);
    res
      .status(500)
      .json({ message: "Ошибка при добавлении расписания", error });
    throw error;
  }
};

const addUserSchedule = async (req, res) => {
  const { id, user_id } = req.body;
  try {
    if (id === null && user_id === null) {
      return res.status(404).json({ message: "body is null" });
    } else {
      const existingRecord = await Schedule.findOne({
        where: {
          id: id,
          user_id: null,
        },
      });

      if (!existingRecord) {
        return res.status(405).json({ message: "Это время уже занято" });
      }
      const result = await Schedule.update(
        {
          user_id: user_id,
        },
        {
          where: {
            id: id,
            user_id: null,
          },
        }
      );
      if (result === null || result.length === 0) {
        console.error(
          "Ошибка при выполнение запроса на выбор времени расписания (res null)",
          error
        );
        return res.status(405).json({
          message: "Ошибка при выполнение запроса на выбор времени расписания",
        });
      } else {
        return res.status(200).json({ result });
      }
    }
  } catch (error) {
    console.error(
      "Ошибка при выполнение запроса на выбор времени расписания",
      error
    );
    res.status(500).json({ message: "Ошибка при выполнение запроса", error });
    throw error;
  }
};

const deleteSchedule = async (req, res) => {
  const { id } = req.body;
  try {
    if (id === null) {
      return res.status(404).json({ message: "body is null" });
    } else {
      const result = await Schedule.destroy({
        where: {
          id: id,
          user_id: null,
        },
      });
      if (result === null || result.length === 0) {
        console.error(
          "Ошибка при выполнение запроса на удаление расписания (res null)",
          error
        );
        return res
          .status(405)
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
    if (result === null || result.length === 0) {
      return res.status(404).json({ message: "schedules is null" });
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
    if (result === null || result.length === 0) {
      return res.status(404).json({ message: "free schedules is null" });
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
    if (result === null || result.length === 0) {
      return res.status(404).json({ message: "free schedules is null" });
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
  addSchedule,
  addUserSchedule,
};
