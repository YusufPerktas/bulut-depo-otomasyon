const express = require("express");
const router = express.Router();
const UrunDemirbasController = require("../controllers/UrunDemirbasController");

// 🔹 Tüm ürün ve demirbaşları getir
router.get("/urunler-ve-demirbaslar", UrunDemirbasController.getAllProductsAndAssets);

module.exports = router;
