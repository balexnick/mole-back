const express = require("express");
const router = express.Router();
const { getScore, setScore, updateScore} = require("../controllers/ScoreController");
const { register, login } = require("../controllers/UserController");
const jwtToken = require("../utils/jwtToken").verifyToken;

router.post("/register", register);

router.post("/login", login);

router.get("/score", getScore);

router.post("/set", jwtToken, setScore);

router.post("/update", jwtToken, updateScore);

module.exports = router;
