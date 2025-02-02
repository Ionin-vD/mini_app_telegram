const express = require("express");
const {
  getAllUsers,
  getAllSchedules,
  checkAuthUser,
  getFreeSchedule,
  addFreeSchedule,
} = require("../controllers/controllers");

const router = express.Router();

router.get("/get_all_user", getAllUsers);

router.get("/get_all_schedule", getAllSchedules);

router.post("/check_auth", checkAuthUser);

router.get("/get_free_schedule", getFreeSchedule);

router.post("/add_free_schedule", addFreeSchedule);

module.exports = router;
