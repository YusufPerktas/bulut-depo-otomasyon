const { pool } = require("../models/connection");

// 1. Toplam Kar/Zarar
const getKarZarar = (req, res) => {
    const satisQuery = `SELECT COALESCE(SUM(Urun_Miktar * Satis_Fiyati), 0) AS toplamGelir FROM urun_satis`;
    const urunMaliyetQuery = `SELECT COALESCE(SUM(Miktar * Maliyet_Fiyati), 0) AS toplamUrunMaliyet FROM urun_maliyet`;
    const demirbasMaliyetQuery = `SELECT COALESCE(SUM(Miktar * Maliyet_Fiyati), 0) AS toplamDemirbasMaliyet FROM demirbas_maliyet`;
  
    pool.query(satisQuery, (err1, [satisResult]) => {
        if (err1) return res.status(500).json({ error: "Satış verisi alınamadı" });

        pool.query(urunMaliyetQuery, (err2, [urunMaliyetResult]) => {
            if (err2) return res.status(500).json({ error: "Ürün maliyet verisi alınamadı" });

            pool.query(demirbasMaliyetQuery, (err3, [demirbasMaliyetResult]) => {
                if (err3) return res.status(500).json({ error: "Demirbaş maliyet verisi alınamadı" });

                const gelir = Number(satisResult?.toplamGelir || 0);
                const urunGider = Number(urunMaliyetResult?.toplamUrunMaliyet || 0);
                const demirbasGider = Number(demirbasMaliyetResult?.toplamDemirbasMaliyet || 0);

                const karZarar = gelir - (urunGider + demirbasGider);

                res.json({ karZarar: karZarar.toFixed(2) });
            });
        });
    });
};

// 2. En Çok Satılan Ürün
const getEnCokSatilanUrun = (req, res) => {
    const sql = `
        SELECT u.Urun_Adi, SUM(s.Urun_Miktar) AS toplamSatis
        FROM urun_satis s
        JOIN urun u ON s.Urun_id = u.Urun_id
        GROUP BY u.Urun_Adi
        ORDER BY toplamSatis DESC
        LIMIT 3
    `;

    pool.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Sorgu hatası" });

        const urunler = results.map((row) => row.Urun_Adi);
        res.json({ urunler });
    });
};

// 3. En Az Stoğu Olan Ürün
const getEnAzStokUrun = (req, res) => {
    const sql = `
        SELECT u.Urun_id, u.Urun_Adi, SUM(s.Stok_Miktar) AS toplamStok
        FROM urun_stok s
        JOIN urun u ON s.Urun_id = u.Urun_id
        GROUP BY u.Urun_id, u.Urun_Adi
        HAVING toplamStok > 0
        ORDER BY toplamStok ASC
        LIMIT 3
    `;

    pool.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Sorgu hatası" });

        const urunler = results.map((row) => ({
            urunAdi: row.Urun_Adi,
            stok: row.toplamStok,
        }));

        res.json({ urunler });
    });
};

// 4. En Az Stoğu Olan Demirbaş
const getEnAzStokDemirbas = (req, res) => {
    const sql = `
        SELECT d.Demirbas_id, d.Demirbas_Adi, SUM(s.Stok_Miktar) AS toplamStok
        FROM demirbas_stok s
        JOIN demirbas d ON s.Demirbas_id = d.Demirbas_id
        GROUP BY d.Demirbas_id, d.Demirbas_Adi
        HAVING toplamStok > 0
        ORDER BY toplamStok ASC
        LIMIT 3
    `;

    pool.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Sorgu hatası" });

        const demirbaslar = results.map((row) => ({
            demirbasAdi: row.Demirbas_Adi,
            stok: row.toplamStok,
        }));

        res.json({ demirbaslar });
    });
};

module.exports = {
    getKarZarar,
    getEnCokSatilanUrun,
    getEnAzStokUrun,
    getEnAzStokDemirbas,
};
