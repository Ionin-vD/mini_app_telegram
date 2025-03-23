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
  getAllScheduleIsCourse,
  addSchedule,
  addUserSchedule,
} = require("../controllers/schedule_controllers");

const {
  addCourse,
  updateTitleCourse,
  getAllCourse,
  addUserInCourse,
  addThemeInCourse,
  getAllThemesInCourses,
  updateThemeInCourse,
  changeAuthUserInCourse,
  getAllUsersInCourses,
  checkThemeIsBusy,
  deleteTheme,
  getAllQuestionsOfThemes,
  updateQuestionInTheme,
  deleteQuestion,
  addQuestionInTheme,
  deleteCourse,
  getTitleThemeOfId,
  deleteUserInCourse,
  checkAuthUserInCourse,
  getCoursesWhereUserAuth,
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

router.post("/add_schedule", addSchedule);

router.post("/add_user_schedule", addUserSchedule);

router.post("/delete_schedule", deleteSchedule);

router.post("/get_all_schedule_is_course", getAllScheduleIsCourse);

//course
router.get("/get_all_courses", getAllCourse);

router.post("/get_all_themes_in_course", getAllThemesInCourses);

router.post("/get_all_users_in_course", getAllUsersInCourses);

router.post("/add_course", addCourse);

router.post("/update_title_course", updateTitleCourse);

router.post("/add_user_in_course", addUserInCourse);

router.post("/add_theme_in_course", addThemeInCourse);

router.post("/update_theme_in_course", updateThemeInCourse);

router.post("/change_auth_user_in_course", changeAuthUserInCourse);

router.post("/check_auth_user_in_course", checkAuthUserInCourse);

router.post("/check_themes_is_busy", checkThemeIsBusy);

router.post("/delete_theme", deleteTheme);

router.post("/get_all_question_of_theme", getAllQuestionsOfThemes);

router.post("/update_question_in_theme", updateQuestionInTheme);

router.post("/delete_question", deleteQuestion);

router.post("/add_question_in_theme", addQuestionInTheme);

router.post("/delete_course", deleteCourse);

router.post("/delete_user_in_course", deleteUserInCourse);

router.post("/get_title_theme_of_id", getTitleThemeOfId);

router.post("/get_courses_where_user_auth", getCoursesWhereUserAuth);

module.exports = router;
