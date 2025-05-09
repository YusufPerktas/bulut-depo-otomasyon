const express = require("express");
const router = express.Router();
const controller = require("../controllers/KartController");

router.get("/kar-zarar", controller.getKarZarar);
router.get("/en-cok-satilan", controller.getEnCokSatilanUrun);
router.get("/en-az-stok-urun", controller.getEnAzStokUrun);
router.get("/en-az-stok-demirbas", controller.getEnAzStokDemirbas);

module.exports = router;
