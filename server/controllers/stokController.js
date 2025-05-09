const stokArama = require("../models/stokArama"); 
const { StockIslem } = require("../models/stockIslem");
const { kontrolVeMailAt } = require("../utils/stokKontrol");

// 🟢 Stokları arama fonksiyonu
const araStok = (req, res) => {
    const { q } = req.query;

    stokArama.araStok(q, (err, results) => {
        if (err) {
            console.error("Stok arama hatası:", err);
            return res.status(500).json({ error: "Veritabanı hatası" });
        }
        res.json(results);
    });
};

// 🟢 Stok Güncelleme (Ekleme veya Çıkarma)
const guncelleStok = (req, res) => {
    const { category, productId, sizeId, quantity, price, transactionType, date } = req.body;

    if (!category || !productId || !sizeId || !quantity || !transactionType || !date) {
        return res.status(400).json({ error: "Eksik parametreler" });
    }

    if (transactionType === "ekle" && price === undefined) {
        return res.status(400).json({ error: "Ekleme işleminde fiyat zorunludur" });
    }

    if (transactionType === "cikar" && category !== "Demirbaş" && price === undefined) {
        return res.status(400).json({ error: "Ürün satışında fiyat zorunludur" });
    }

    StockIslem.updateStock({ category, productId, sizeId, quantity, transactionType }, (err, result) => {
        if (err) {
            console.error("Stok güncelleme hatası:", err);
            return res.status(500).json({ error: "Stok güncellenirken hata oluştu" });
        }

        StockIslem.addTransaction({ category, productId, sizeId, quantity, price, transactionType, date }, async (err, result) => {
            if (err) {
                console.error("Maliyet/Satış kaydı hatası:", err);
                return res.status(500).json({ error: "Maliyet veya satış kaydı eklenirken hata oluştu" });
            }

            // 🟢 Eğer çıkış işlemi yapılıyorsa, stok kontrolü yap
            if (transactionType === "cikar" && category === "Ürün") {
                try {
                    await kontrolVeMailAt("Urun", productId, sizeId);
                } catch (mailErr) {
                    console.error("Stok kontrol/mail hatası:", mailErr);
                }
            }

            res.json({ message: "Stok işlemi başarıyla gerçekleştirildi." });
        });
    });
};

// 🟢 Ürünleri Kategoriye Göre Getirme
const getProductsByCategory = (req, res) => {
    const { category } = req.params;

    if (!category) {
        return res.status(400).json({ error: "Kategori belirtilmelidir." });
    }

    StockIslem.getByCategory(category, (err, results) => {
        if (err) {
            console.error("Ürün/Demirbaş listeleme hatası:", err);
            return res.status(500).json({ error: "Veritabanı hatası" });
        }
        res.json(results);
    });
};

// 🟢 Bedenleri Ürüne Göre Getirme
const getSizesByProduct = (req, res) => {
    const { category, productId } = req.params;

    if (!category || !productId) {
        return res.status(400).json({ error: "Kategori ve ürün ID belirtilmelidir." });
    }

    StockIslem.getSizesByProduct(productId, category, (err, results) => {
        if (err) {
            console.error("Beden listeleme hatası:", err);
            return res.status(500).json({ error: "Veritabanı hatası" });
        }
        res.json(results);
    });
};

module.exports = { araStok, guncelleStok, getProductsByCategory, getSizesByProduct };
