const { pool } = require("../models/connection");
const { kontrolVeMailAt } = require("../utils/stokKontrol");

// Kullanıcıları getir
const getKullanicilar = (req, res) => {
    pool.query("SELECT * FROM kullanici ORDER BY Kullanici_Adi", (err, results) => {
        if (err) return res.status(500).json({ error: "Veritabanı hatası" });
        res.json(results);
    });
};

// Demirbaşları getir
const getDemirbaslar = (req, res) => {
    pool.query("SELECT * FROM demirbas ORDER BY Demirbas_Adi", (err, results) => {
        if (err) return res.status(500).json({ error: "Veritabanı hatası" });
        res.json(results);
    });
};

// Seçilen demirbaşın beden/özelliklerini getir
const getBedenler = (req, res) => {
    const { demirbasId } = req.query;
    if (!demirbasId) return res.status(400).json({ error: "Demirbaş ID gerekli" });

    pool.query(
        "SELECT * FROM demirbas_bedenozellik WHERE Demirbas_id = ?",
        [demirbasId],
        (err, results) => {
            if (err) return res.status(500).json({ error: "Veritabanı hatası" });
            res.json(results);
        }
    );
};

// Zimmetleme işlemi
const zimmetEkle = (req, res) => {
    const { kullaniciId, demirbasId, bedenId, miktar, tarih } = req.body;

    if (!kullaniciId || !demirbasId || !bedenId || !miktar || !tarih) {
        return res.status(400).json({ error: "Eksik parametreler" });
    }

    pool.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: "Bağlantı hatası" });

        connection.beginTransaction((err) => {
            if (err) return res.status(500).json({ error: "Transaction hatası" });

            const stokSorgu = `
                SELECT Stok_Miktar FROM demirbas_stok
                WHERE Demirbas_id = ? AND BedenOzellik_id = ?
            `;

            connection.query(stokSorgu, [demirbasId, bedenId], (err, results) => {
                if (err || results.length === 0 || results[0].Stok_Miktar < miktar) {
                    return connection.rollback(() => {
                        res.status(400).json({ error: "Yetersiz stok veya geçersiz istek" });
                    });
                }

                const yeniStok = results[0].Stok_Miktar - miktar;

                const stokGuncelle = `
                    UPDATE demirbas_stok SET Stok_Miktar = ? 
                    WHERE Demirbas_id = ? AND BedenOzellik_id = ?
                `;

                connection.query(stokGuncelle, [yeniStok, demirbasId, bedenId], (err) => {
                    if (err) return connection.rollback(() => res.status(500).json({ error: "Stok güncelleme hatası" }));

                    const zimmetEkle = `
                        INSERT INTO demirbas_zimmetleme
                        (Demirbas_id, Kullanici_id, BedenOzellik_id, Stok_Miktari, Tarih)
                        VALUES (?, ?, ?, ?, ?)
                    `;

                    connection.query(zimmetEkle, [demirbasId, kullaniciId, bedenId, miktar, tarih], async (err) => {
                        if (err) return connection.rollback(() => res.status(500).json({ error: "Zimmetleme hatası" }));

                        try {
                            await kontrolVeMailAt("Demirbas", demirbasId, bedenId);
                        } catch (mailErr) {
                            console.error("Stok kontrol/mail hatası:", mailErr);
                        }

                        connection.commit((err) => {
                            if (err) return connection.rollback(() => res.status(500).json({ error: "Commit hatası" }));
                            connection.release();
                            res.json({ message: "Zimmetleme başarılı" });
                        });
                    });
                });
            });
        });
    });
};

// Zimmet teslim işlemi
const zimmetTeslim = (req, res) => {
    const { kullaniciId, demirbasId, bedenId, miktar, tarih } = req.body;

    if (!kullaniciId || !demirbasId || !bedenId || !miktar || !tarih) {
        return res.status(400).json({ error: "Eksik parametreler" });
    }

    pool.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: "Bağlantı hatası" });

        connection.beginTransaction((err) => {
            if (err) return res.status(500).json({ error: "Transaction başlatılamadı" });

            const zimmetSorgu = `
                SELECT Zimmet_id, Stok_Miktari FROM demirbas_zimmetleme
                WHERE Kullanici_id = ? AND Demirbas_id = ? AND BedenOzellik_id = ?
            `;

            connection.query(zimmetSorgu, [kullaniciId, demirbasId, bedenId], (err, results) => {
                if (err || results.length === 0) {
                    return connection.rollback(() => {
                        res.status(400).json({ error: "Zimmet kaydı bulunamadı" });
                    });
                }

                const zimmet = results[0];
                if (zimmet.Stok_Miktari < miktar) {
                    return connection.rollback(() => {
                        res.status(400).json({ error: "Teslim miktarı zimmet miktarından fazla olamaz" });
                    });
                }

                const stokGuncelle = `
                    UPDATE demirbas_stok
                    SET Stok_Miktar = Stok_Miktar + ?
                    WHERE Demirbas_id = ? AND BedenOzellik_id = ?
                `;

                connection.query(stokGuncelle, [miktar, demirbasId, bedenId], (err) => {
                    if (err) return connection.rollback(() => res.status(500).json({ error: "Stok güncellenemedi" }));

                    const yeniMiktar = zimmet.Stok_Miktari - miktar;

                    const zimmetQuery = yeniMiktar === 0
                        ? `DELETE FROM demirbas_zimmetleme WHERE Zimmet_id = ?`
                        : `UPDATE demirbas_zimmetleme SET Stok_Miktari = ? WHERE Zimmet_id = ?`;

                    const zimmetParams = yeniMiktar === 0 ? [zimmet.Zimmet_id] : [yeniMiktar, zimmet.Zimmet_id];

                    connection.query(zimmetQuery, zimmetParams, (err) => {
                        if (err) return connection.rollback(() => res.status(500).json({ error: "Zimmet güncellenemedi" }));

                        const logEkle = `
                            INSERT INTO islemkayitlari (Entity_Type, Entity_id, Stok_Miktar, Islem_Turu, Tarih)
                            VALUES ('Demirbas', ?, ?, 'Teslim', ?)
                        `;

                        connection.query(logEkle, [demirbasId, miktar, tarih], (err) => {
                            if (err) return connection.rollback(() => res.status(500).json({ error: "Log kaydedilemedi" }));

                            connection.commit((err) => {
                                if (err) return connection.rollback(() => res.status(500).json({ error: "Commit hatası" }));
                                connection.release();
                                res.json({ message: "Teslim işlemi başarıyla tamamlandı" });
                            });
                        });
                    });
                });
            });
        });
    });
};

// Zimmet arama
const zimmetArama = (req, res) => {
    const { arama } = req.query;
    const sorgu = `
        SELECT 
            k.Kullanici_Adi AS kullaniciAdi,
            d.Demirbas_Adi AS demirbasAdi,
            b.BedenOzellik AS bedenOzellik,
            z.Stok_Miktari AS stokMiktari,
            z.Tarih AS tarih
        FROM demirbas_zimmetleme z
        JOIN kullanici k ON k.Kullanici_id = z.Kullanici_id
        JOIN demirbas d ON d.Demirbas_id = z.Demirbas_id
        JOIN demirbas_bedenozellik b ON b.BedenOzellik_id = z.BedenOzellik_id
        WHERE k.Kullanici_Adi LIKE ? OR d.Demirbas_Adi LIKE ?
        ORDER BY z.Tarih DESC
    `;

    pool.query(sorgu, [`%${arama}%`, `%${arama}%`], (err, results) => {
        if (err) return res.status(500).json({ error: "Arama hatası" });
        res.json(results);
    });
};

module.exports = {
    getKullanicilar,
    getDemirbaslar,
    getBedenler,
    zimmetEkle,
    zimmetTeslim,
    zimmetArama,
};
