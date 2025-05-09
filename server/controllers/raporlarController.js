const { pool } = require("../models/connection");

// 1. En Çok Satılan Ürünler
const enCokSatanlar = (req, res) => {
    const query = `
        SELECT u.Urun_Adi, SUM(s.Urun_Miktar) AS ToplamSatis
        FROM urun_satis s
        JOIN urun u ON u.Urun_id = s.Urun_id
        GROUP BY s.Urun_id
        ORDER BY ToplamSatis DESC
        LIMIT 10
    `;

    pool.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: "Veritabanı hatası" });
        res.json(results);
    });
};

// 2. Stok - Satış Karşılaştırması
const stokVeSatis = (req, res) => {
    const query = `
        SELECT 
            u.Urun_Adi,
            COALESCE((SELECT SUM(m.Miktar) FROM urun_maliyet m WHERE m.Urun_id = u.Urun_id), 0) AS ToplamAlim,
            COALESCE((SELECT SUM(s.Urun_Miktar) FROM urun_satis s WHERE s.Urun_id = u.Urun_id), 0) AS ToplamSatis
        FROM urun u
        ORDER BY u.Urun_Adi ASC
    `;

    pool.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: "Veritabanı hatası" });
        res.json(results);
    });
};

// 3. Satış Performansı
const satisPerformansi = (req, res) => {
    const query = `
        SELECT 
            u.Urun_Adi,
            COALESCE(SUM(m.Miktar * m.Maliyet_Fiyati), 0) AS ToplamMaliyet,
            COALESCE(SUM(s.Urun_Miktar * s.Satis_Fiyati), 0) AS ToplamSatisTutar
        FROM urun u
        LEFT JOIN urun_maliyet m ON u.Urun_id = m.Urun_id
        LEFT JOIN urun_satis s ON u.Urun_id = s.Urun_id
        GROUP BY u.Urun_id
        ORDER BY u.Urun_Adi ASC
    `;

    pool.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: "Veritabanı hatası" });
        res.json(results);
    });
};

module.exports = {
    enCokSatanlar,
    stokVeSatis,
    satisPerformansi,
};
