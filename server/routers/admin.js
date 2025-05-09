const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.post("/login", adminController.login);
router.get("/auth", adminController.auth);
router.post("/logout", adminController.logout);

module.exports = router;
