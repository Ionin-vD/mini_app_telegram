const express = require("express");
const {
  getAllUsers,
  getAllSchedules,
  checkAuthUser,
  getFreeSchedule,
  addFreeSchedule,
  deleteSchedule,
} = require("../controllers/controllers");

const router = express.Router();

router.post("/check_auth", checkAuthUser);

router.get("/get_all_user", getAllUsers);

router.get("/get_all_schedule", getAllSchedules);

router.get("/get_free_schedule", getFreeSchedule);

router.post("/add_free_schedule", addFreeSchedule);

router.post("/delete_schedule", deleteSchedule);

module.exports = router;
