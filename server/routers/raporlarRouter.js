const express = require("express");
const router = express.Router();
const controller = require("../controllers/raporlarController");

router.get("/en-cok-satanlar", controller.enCokSatanlar);
router.get("/stok-satis", controller.stokVeSatis);
router.get("/performans", controller.satisPerformansi);

module.exports = router;
