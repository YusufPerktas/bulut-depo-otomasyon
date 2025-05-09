const express = require("express");
const router = express.Router();
const controller = require("../controllers/zimmetlemeController");

// GET işlemleri
router.get("/kullanicilar", controller.getKullanicilar);
router.get("/demirbaslar", controller.getDemirbaslar);
router.get("/bedenler", controller.getBedenler);
router.get("/arama", controller.zimmetArama);

// POST işlemleri
router.post("/", controller.zimmetEkle);
router.post("/teslim", controller.zimmetTeslim);

module.exports = router;
