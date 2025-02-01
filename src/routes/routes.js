const express = require("express");
const { getAllUsers, getAllSchedules } = require("../controllers/controllers");

const router = express.Router();

router.get("/get_all_user", getAllUsers);

router.get("/get_all_schedule", getAllSchedules);

module.exports = router;
