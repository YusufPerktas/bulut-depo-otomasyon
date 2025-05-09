const express = require("express");
const router = express.Router();
const KullaniciControlller = require("../controllers/KullaniciController");

// 🟢 Kullanıcıları Getir
router.get("/kullanici-getir", KullaniciControlller.getKullanicilar);

// 🟡 Kullanıcı Güncelle
router.post("/kullanici-guncelle/:id", KullaniciControlller.updateKullanici);

// 🔴 Yeni Kullanıcı Ekle
router.post("/kullanici-ekle", KullaniciControlller.addKullanici);

// ❌ Kullanıcı Sil
router.delete("/kullanici-sil/:id", KullaniciControlller.deleteKullanici);


module.exports = router;
