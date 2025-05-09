// models/connection.js
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config(); // .env dosyasını yükle

// Veritabanı konfigurasyonu
const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// Bağlantı havuzu (pool) oluşturma
const pool = mysql.createPool(config);

// Havuzu test etme (isteğe bağlı)
pool.getConnection((err, connection) => {
  if (err) {
    console.error("MySQL veritabanına bağlanırken hata oluştu:", err);
    process.exit(1); // Bağlantı sağlanamadıysa projeyi sonlandırabilirsin
  } else {
    console.log("MySQL veritabanına başarıyla bağlanıldı.");
    connection.release(); // Bağlantıyı serbest bırak
  }
});

// pool objesini dışa aktar
module.exports = { pool };
