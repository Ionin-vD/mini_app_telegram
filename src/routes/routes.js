const express = require("express");
const {
  getAllUsers,
  getAllSchedules,
  checkAuthUser,
} = require("../controllers/controllers");

const router = express.Router();

router.get("/get_all_user", getAllUsers);

router.get("/get_all_schedule", getAllSchedules);

router.post("/check_auth", checkAuthUser);

module.exports = router;
