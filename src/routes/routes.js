const express = require("express");

const {
  getAllUsers,
  checkAuthUser,
  updateUser,
  getAllUsersIsDelete,
} = require("../controllers/user_controllers");

const {
  getAllSchedules,
  getFreeSchedule,
  addFreeSchedule,
  deleteSchedule,
} = require("../controllers/schedule_controllers");

const {
  addCourse,
  getAllCourse,
} = require("../controllers/course_controllers");

const router = express.Router();

router.get("/get_all_user", getAllUsers);

router.get("/get_all_user_is_delete", getAllUsersIsDelete);

router.get("/get_all_schedule", getAllSchedules);

router.get("/get_free_schedule", getFreeSchedule);

router.get("/get_all_courses", getAllCourse);

router.post("/check_auth", checkAuthUser);

router.post("/update_user", updateUser);

router.post("/add_free_schedule", addFreeSchedule);

router.post("/delete_schedule", deleteSchedule);

router.post("/add_course", addCourse);

module.exports = router;
