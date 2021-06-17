const { Router } = require("express");

const { login, logout, signup } = require("")

const router = Router();

router.post("/login", login);

router.post("/logout", logout);

router.post("/signup", signup)

module.exports = router;
