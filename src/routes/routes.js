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
  updateTitleCourse,
  getAllCourse,
  addUserInCourse,
  addThemeInCourse,
  getAllThemesInCourses,
} = require("../controllers/course_controllers");

const router = express.Router();

//user
router.get("/get_all_user", getAllUsers);

router.get("/get_all_user_is_delete", getAllUsersIsDelete);

router.post("/check_auth", checkAuthUser);

router.post("/update_user", updateUser);

//schedule
router.get("/get_all_schedule", getAllSchedules);

router.get("/get_free_schedule", getFreeSchedule);

router.post("/add_free_schedule", addFreeSchedule);

router.post("/delete_schedule", deleteSchedule);

//course
router.get("/get_all_courses", getAllCourse);

router.post("/get_all_themes_in_course", getAllThemesInCourses);

router.post("/add_course", addCourse);

router.post("/update_title_course", updateTitleCourse);

router.post("/add_user_in_course", addUserInCourse);

router.post("/add_theme_in_course", addThemeInCourse);

module.exports = router;
