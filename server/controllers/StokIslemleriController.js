const { pool } = require('../models/connection');

exports.getUrunIslemleri = (req, res) => {
  const query = `
    SELECT 
      u.Urun_Adi AS adi,
      b.BedenOzellik AS bedenOzellik,
      m.Miktar AS miktar,
      m.Maliyet_Fiyati AS fiyat,
      'Stok Ekle' AS islem,
      m.Tarih AS tarih
    FROM Urun_Maliyet m
    JOIN Urun u ON m.Urun_id = u.Urun_id
    JOIN Urun_BedenOzellik b ON m.BedenOzellik_id = b.BedenOzellik_id

    UNION

    SELECT 
      u.Urun_Adi AS adi,
      b.BedenOzellik AS bedenOzellik,
      s.Urun_Miktar AS miktar,
      s.Satis_Fiyati AS fiyat,
      'Stok Çıkar' AS islem,
      s.Tarih AS tarih
    FROM Urun_Satis s
    JOIN Urun u ON s.Urun_id = u.Urun_id
    JOIN Urun_BedenOzellik b ON s.BedenOzellik_id = b.BedenOzellik_id

    ORDER BY tarih DESC
  `;

  pool.query(query, (err, results) => {
    if (err) {
      console.error("Ürün işlemleri hatası:", err);
      return res.status(500).json({ error: 'Veri alınamadı' });
    }
    res.json(results);
  });
};

exports.getDemirbasIslemleri = (req, res) => {
  const query = `
    SELECT 
      d.Demirbas_Adi AS adi,
      b.BedenOzellik AS bedenOzellik,
      m.Miktar AS miktar,
      m.Maliyet_Fiyati AS fiyat,
      'Stok Ekle' AS islem,
      m.Tarih AS tarih
    FROM Demirbas_Maliyet m
    JOIN Demirbas d ON m.Demirbas_id = d.Demirbas_id
    JOIN Demirbas_BedenOzellik b ON m.BedenOzellik_id = b.BedenOzellik_id

    UNION

    SELECT 
      d.Demirbas_Adi AS adi,
      b.BedenOzellik AS bedenOzellik,
      h.Demirbas_Miktar AS miktar,
      0 AS fiyat,
      'Stok Çıkar' AS islem,
      h.Tarih AS tarih
    FROM Demirbas_Hurda h
    JOIN Demirbas d ON h.Demirbas_id = d.Demirbas_id
    JOIN Demirbas_BedenOzellik b ON h.BedenOzellik_id = b.BedenOzellik_id

    ORDER BY tarih DESC
  `;

  pool.query(query, (err, results) => {
    if (err) {
      console.error("Demirbaş işlemleri hatası:", err);
      return res.status(500).json({ error: 'Veri alınamadı' });
    }
    res.json(results);
  });
};
