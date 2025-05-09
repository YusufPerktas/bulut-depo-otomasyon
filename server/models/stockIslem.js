const { pool } = require("./connection");

const StockIslem = {
  // 📌 1️⃣ Ürün/Demirbaşları Kategoriye Göre Getir
  getByCategory: (category, callback) => {
    const query = `SELECT ${category === "Demirbaş" ? "Demirbas_id" : "Urun_id"} AS id, ${category === "Demirbaş" ? "Demirbas_Adi" : "Urun_Adi"} adi 
                   FROM ${category === "Demirbaş" ? "demirbas" : "urun"}`;
    pool.query(query, (err, results) => {
      if (err) {
        console.error("Kategoriye göre ürün/demirbaş getirme hatası:", err);
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  // 📌 2️⃣ Ürün/Demirbaş Beden/Özelliklerini Getir
  getSizesByProduct: (productId, category, callback) => {
    const query = `SELECT BedenOzellik_id AS id, BedenOzellik AS beden 
                   FROM ${category === "Demirbaş" ? "demirbas_bedenozellik" : "urun_bedenozellik"} 
                   WHERE ${category === "Demirbaş" ? "demirbas_id = ?" : "urun_id = ?"}`;
    pool.query(query, [productId], callback);
  },

  // 📌 3️⃣ Stok Güncelleme (Ekleme ve Çıkarma)
updateStock: (data, callback) => {
    const { category, productId, sizeId, quantity, transactionType } = data;
    const table = category === "Demirbaş" ? "demirbas_stok" : "urun_stok";
    const idField = category === "Demirbaş" ? "Demirbas_id" : "Urun_id";

    const query = transactionType === "ekle"
        ? `UPDATE ${table} SET stok_miktar = stok_miktar + ? WHERE ${idField} = ? AND BedenOzellik_id = ?`
        : `UPDATE ${table} SET stok_miktar = stok_miktar - ? WHERE ${idField} = ? AND BedenOzellik_id = ?`;

    pool.query(query, [quantity, productId, sizeId], callback);
},

  // 📌 4️⃣ Maliyet ve Satış Kayıt Ekleme
  addTransaction: (data, callback) => {
    const { category, productId, sizeId, quantity, price, transactionType, date } = data;
    let query = "";
    let values = [];

    if (transactionType === "ekle") {
      query = `INSERT INTO ${category === "Demirbaş" ? "demirbas_maliyet" : "urun_maliyet"} 
               (${category === "Demirbaş" ? "Demirbas_id" : "Urun_id"}, BedenOzellik_id, Miktar, Maliyet_Fiyati, Tarih) VALUES (?, ?, ?, ?, ?)`;
      values = [productId, sizeId, quantity, price, date];
    } 
    else if (transactionType === "cikar" && category === "Demirbaş") {
      query = `INSERT INTO demirbas_hurda (Demirbas_id, BedenOzellik_id, Demirbas_Miktar, Tarih) VALUES (?, ?, ?, ?)`;
      values = [productId, sizeId, quantity, date];
    } 
    else if (transactionType === "cikar" && category !== "Demirbaş") {
      query = `INSERT INTO urun_satis (Urun_id, BedenOzellik_id, Urun_Miktar, Satis_fiyati, Tarih) VALUES (?, ?, ?, ?, ?)`;
      values = [productId, sizeId, quantity, price, date];
    }
      pool.query(query, values, callback);
   
  }
};

module.exports = { StockIslem };
