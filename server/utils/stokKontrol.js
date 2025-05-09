// utils/stokKontrol.js
const { pool } = require("../models/connection");
const nodemailer = require("nodemailer");

// Mail transporter
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "umuttepetest@gmail.com", // kendi mailin
        pass: "yrwe gtou ciqk jqti",     // Gmail uygulama şifresi
    },
});

// Uyarı eşiği
const STOK_ESIK = 10;

// Genel kontrol fonksiyonu
const kontrolVeMailAt = (tip, id, bedenId) => {
    return new Promise((resolve, reject) => {
        let tabloStok, tabloAdi, kolonId, kolonAd;

        if (tip === "Urun") {
            tabloStok = "urun_stok";
            tabloAdi = "urun";
            kolonId = "Urun_id";
            kolonAd = "Urun_Adi";
        } else if (tip === "Demirbas") {
            tabloStok = "demirbas_stok";
            tabloAdi = "demirbas";
            kolonId = "Demirbas_id";
            kolonAd = "Demirbas_Adi";
        } else {
            return resolve();
        }

        const sorgu = `
            SELECT s.Stok_Miktar, t.${kolonAd} as Ad, b.BedenOzellik
            FROM ${tabloStok} s
            JOIN ${tabloAdi} t ON t.${kolonId} = s.${kolonId}
            JOIN ${tabloAdi}_bedenozellik b ON b.BedenOzellik_id = s.BedenOzellik_id
            WHERE s.${kolonId} = ? AND s.BedenOzellik_id = ?
        `;

        pool.query(sorgu, [id, bedenId], (err, results) => {
            if (err || results.length === 0) return resolve();

            const { Stok_Miktar, Ad, BedenOzellik } = results[0];

            if (Stok_Miktar >= STOK_ESIK) return resolve(); // eşik altı değilse mail atma

            // Admin mailini al
            pool.query("SELECT Email FROM admin LIMIT 1", (err, rows) => {
                if (err || rows.length === 0) return resolve();

                const adminMail = rows[0].Email;

                const mailOptions = {
                    from: "umuttepetest@gmail.com",
                    to: adminMail,
                    subject: "Stok Uyarısı",
                    text: `${Ad} ürününün ${BedenOzellik} bedeni ${STOK_ESIK}'un altına düştü.`,
                };

                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        console.error("Mail gönderilemedi:", err);
                    } else {
                        console.log("Stok uyarı maili gönderildi:", info.response);
                    }
                    resolve();
                });
            });
        });
    });
};

module.exports = { kontrolVeMailAt };
