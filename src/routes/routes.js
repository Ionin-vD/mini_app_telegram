const express = require("express");
const { getAllUsers } = require("../controllers/controllers");

const router = express.Router();

router.get("/get_all", getAllUsers);

module.exports = router;
