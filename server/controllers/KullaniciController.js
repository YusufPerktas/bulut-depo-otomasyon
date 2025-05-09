const KullaniciModel = require("../models/KullaniciModel");

// 🟢 Kullanıcıları Getir
const getKullanicilar = async (req, res) => {
    try {
        const kullanicilar = await KullaniciModel.getAll();
        res.json(kullanicilar);
    } catch (error) {
        console.error("Kullanıcıları çekerken hata oluştu:", error);
        res.status(500).json({ error: "Sunucu hatası" });
    }
};

// 🟡 Kullanıcı Güncelle
const updateKullanici = async (req, res) => {
    const { id } = req.params;
    const { Kullanici_Adi, Iletisim_No, Meslek, E_Posta } = req.body;

    try {
        await KullaniciModel.update(id, Kullanici_Adi, Iletisim_No, Meslek, E_Posta);
        res.json({ message: "Kullanıcı başarıyla güncellendi." });
    } catch (error) {
        console.error("Kullanıcı güncellenirken hata oluştu:", error);
        res.status(500).json({ error: "Sunucu hatası" });
    }
};

// 🔴 Yeni Kullanıcı Ekle
const addKullanici = async (req, res) => {
    const { Kullanici_Adi, Iletisim_No, Meslek, E_Posta, Tarih } = req.body;

    try {
        await KullaniciModel.add(Kullanici_Adi, Iletisim_No, Meslek, E_Posta, Tarih);
        res.json({ message: "Kullanıcı başarıyla eklendi." });
    } catch (error) {
        console.error("Kullanıcı eklerken hata oluştu:", error);
        res.status(500).json({ error: "Sunucu hatası" });
    }
};

// ❌ Kullanıcı Sil
const deleteKullanici = async (req, res) => {
    const { id } = req.params;

    try {
        await KullaniciModel.delete(id);
        res.json({ message: "Kullanıcı başarıyla silindi." });
    } catch (error) {
        console.error("Kullanıcı silinirken hata oluştu:", error);
        res.status(500).json({ error: "Sunucu hatası" });
    }
};

module.exports = { getKullanicilar, updateKullanici, addKullanici, deleteKullanici };
