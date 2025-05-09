const express = require("express");
const router = express.Router();
const UrunDemirbasKayitController = require("../controllers/UrunDemirbasKayitController");

// 🟢 Yeni Ürün/Demirbaş Ekleme API'si
router.post("/ekle", UrunDemirbasKayitController.insertProductOrAsset);

module.exports = router;
