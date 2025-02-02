const express = require("express");
const {
  getAllUsers,
  getAllSchedules,
  checkAuthUser,
  getFreeSchedule,
} = require("../controllers/controllers");

const router = express.Router();

router.get("/get_all_user", getAllUsers);

router.get("/get_all_schedule", getAllSchedules);

router.post("/check_auth", checkAuthUser);

router.get("/get_free_schedule", getFreeSchedule);

module.exports = router;
