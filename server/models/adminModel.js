const { pool } = require("./connection"); // Veritabanı bağlantısı

// 🔹 Admin kullanıcısını veritabanında bulma
const findAdminByUsername = async (username) => {
    try {
        const [results] = await pool.promise().query("SELECT * FROM admin WHERE Admin_Adi = ?", [username]);
        return results.length > 0 ? results[0] : null;
    } catch (error) {
        console.error("Veritabanından admin çekme hatası:", error);
        throw error;
    }
};

module.exports = {
    findAdminByUsername,
};
