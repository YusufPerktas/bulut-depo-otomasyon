const { pool } = require("./connection"); // Doğru bağlantıyı kullan

const KullaniciModel = {
    // 🟢 Kullanıcıları Getir
    getAll: async () => {
        try {
            const [rows] = await pool.promise().query("SELECT * FROM Kullanici");
            return rows;
        } catch (error) {
            console.error("Kullanıcıları çekerken hata oluştu:", error);
            throw error;
        }
    },

    // 🟡 Kullanıcı Güncelle
    update: async (id, Kullanici_Adi, Iletisim_No, Meslek, E_Posta) => {
        try {
            await pool.promise().query(
                "UPDATE Kullanici SET Kullanici_Adi = ?, Iletisim_No = ?, Meslek = ?, E_Posta = ? WHERE Kullanici_id = ?",
                [Kullanici_Adi, Iletisim_No, Meslek, E_Posta, id]
            );
        } catch (error) {
            console.error("Kullanıcı güncellenirken hata oluştu:", error);
            throw error;
        }
    },

    // 🔴 Yeni Kullanıcı Ekle
    add: async (Kullanici_Adi, Iletisim_No, Meslek, E_Posta, Tarih) => {
        try {
            await pool.promise().query(
                "INSERT INTO Kullanici (Kullanici_Adi, Iletisim_No, Meslek, E_Posta, Tarih) VALUES (?, ?, ?, ?, ?)",
                [Kullanici_Adi, Iletisim_No, Meslek, E_Posta, Tarih]
            );
        } catch (error) {
            console.error("Kullanıcı eklerken hata oluştu:", error);
            throw error;
        }
    },

    // ❌ Kullanıcı Sil
delete: async (id) => {
    try {
        await pool.promise().query("DELETE FROM Kullanici WHERE Kullanici_id = ?", [id]);
    } catch (error) {
        console.error("Kullanıcı silinirken hata oluştu:", error);
        throw error;
    }
}
};



module.exports = KullaniciModel;
