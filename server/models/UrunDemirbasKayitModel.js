const { pool } = require("./connection");

const UrunDemirbasKayitModel = {
    // 🟢 Yeni Ürün veya Demirbaş Kaydı Ekle
    insertProductOrAsset: async (kategori, urunAdi, tarih, stoklar) => {
       let insertSQL, idField, mainTable, featureTable, stockTable, costTable;

        // 🟢 Ürün veya Demirbaş İçin Tabloları Ayarla
        if (kategori === "Ürün") {
            mainTable = "urun";
            featureTable = "urun_bedenozellik";
            stockTable = "urun_stok";
            costTable = "urun_maliyet";
            insertSQL = `INSERT INTO urun (Urun_Adi, Tarih) VALUES (?, ?)`;
            idField = "Urun_id";
        } else {
            mainTable = "demirbas";
            featureTable = "demirbas_bedenozellik";
            stockTable = "demirbas_stok";
            costTable = "demirbas_maliyet";
            insertSQL = `INSERT INTO demirbas (Demirbas_Adi, Tarih) VALUES (?, ?)`;
            idField = "Demirbas_id";
        }

        try {
            const connection = await pool.promise().getConnection();
            await connection.beginTransaction();

            // 🟢 1️⃣ Ürün veya Demirbaş Ekle
            const [productResult] = await connection.query(insertSQL, [urunAdi, tarih]);
            const newProductId = productResult.insertId;

            for (const stok of stoklar) {
                // 🟢 2️⃣ Beden/Özellik Ekle
               const [featureResult] = await connection.query(
                    `INSERT INTO ${featureTable} (${idField}, BedenOzellik, Tarih) VALUES (?, ?, ?)`,
                    [newProductId, stok.beden, tarih]
                );
                const newFeatureId = featureResult.insertId;

                // 🟢 3️⃣ Stok Kaydı Ekle
                await connection.query(
                    `INSERT INTO ${stockTable} (${idField}, BedenOzellik_id, Stok_Miktar) VALUES (?, ?, ?)`,
                    [newProductId, newFeatureId, stok.stokMiktari]
                );

                // 🟢 4️⃣ Maliyet Kaydı Ekle
                await connection.query(
                    `INSERT INTO ${costTable} (${idField}, BedenOzellik_id, Miktar, Maliyet_Fiyati, Tarih) VALUES (?, ?, ?, ?, ?)`,
                    [newProductId, newFeatureId, stok.stokMiktari, stok.maliyet, tarih]
                );
            }

            await connection.commit();
            connection.release();
            return { success: true, message: "Ürün/Demirbaş başarıyla kaydedildi!" };
        } catch (error) {
            console.error("Ürün/Demirbaş ekleme hatası:", error);
            throw new Error("Ürün/Demirbaş eklenirken hata oluştu!");
        }
    },
};

module.exports = UrunDemirbasKayitModel;
