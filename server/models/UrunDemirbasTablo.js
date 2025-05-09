const { pool } = require("./connection"); // 🔹 Veritabanı bağlantısı

const parseId = (combinedId) => {
  const parts = combinedId.split('-');
  return {
    type: parts[0], // 'Urun' veya 'Demirbas'
    id: parts[1] // Orijinal ID
  };
};
//bu yukarıdaki kodun alttaki fonksiyona eklenmesi gerekebilir çünkü biz alttaki fonksiyona erişip işlem yapıyoruz

const UrunDemirbasTablo = {
  // 🔹 Tüm Ürün ve Demirbaşları Getir (Kategori Belirterek)
  getAll: (callback) => {
    const sql = `
      SELECT CONCAT('Urun-', Urun_id) AS id, Urun_Adi AS ad, 'Ürün' AS kategori, Tarih FROM urun
      UNION ALL
      SELECT CONCAT('Demirbas-', Demirbas_id) AS id, Demirbas_Adi AS ad, 'Demirbaş' AS kategori, Tarih FROM demirbas
      ORDER BY Tarih DESC;
    `;

    pool.query(sql, callback);
  },

};

module.exports = UrunDemirbasTablo;

