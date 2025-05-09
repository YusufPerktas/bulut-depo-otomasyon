const express = require('express');
const router = express.Router();
const StokIslemleriController = require('../controllers/StokIslemleriController');

router.get('/urun', StokIslemleriController.getUrunIslemleri);
router.get('/demirbas', StokIslemleriController.getDemirbasIslemleri);

module.exports = router;
