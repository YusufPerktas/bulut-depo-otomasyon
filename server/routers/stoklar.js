const express = require("express");
const router = express.Router();
const stokController = require("../controllers/stokController");

router.get("/ara", stokController.araStok);
router.post("/guncelle", stokController.guncelleStok);
router.get("/category/:category", stokController.getProductsByCategory);
router.get("/size/:category/:productId", stokController.getSizesByProduct);

module.exports = router;
