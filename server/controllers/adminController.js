const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const adminModel = require("../models/adminModel");

// 🔹 Login İşlemi
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "Kullanıcı adı ve parola gereklidir." });
        }


        // Admin'i veritabanında ara
        const admin = await adminModel.findAdminByUsername(username);
        if (!admin) {
            console.error("Kullanıcı veritabanında bulunamadı:", username);
            return res.status(401).json({ message: "Geçersiz kullanıcı adı veya şifre-kullanıcı" });
        }



        const isMatch = await bcrypt.compare(password, admin.Admin_Sifre);
        if (!isMatch) {
            console.error("❌ Şifre eşleşmedi:", {
                girilenSifre: password,
                veritabanindakiHash: admin.Admin_Sifre
            });
            return res.status(401).json({ message: "Geçersiz kullanıcı adı veya şifre-şifre" });
        }

        console.log("✅ Şifre eşleşti, token oluşturuluyor...");

        // 🔹 JWT Token oluştur
        const token = jwt.sign(
            { id: admin.Admin_id, username: admin.Admin_Adi },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        console.log("✅ Token oluşturuldu");

        // 🔹 HTTP-Only Cookie olarak token'ı set et
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3600000, // 1 saat
        });

        return res.json({ message: "Giriş başarılı"});
    } catch (error) {
        console.error("Giriş hatası:", error);
        return res.status(500).json({ message: "Sunucu hatası" });
    }
};

// 🔹 Yetkilendirme Kontrolü (Admin giriş yapmış mı?)
const auth = (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Yetkisiz erişim" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Geçersiz token" });
        }
        return res.json({ message: "Yetkilendirildi", user: decoded });
    });
};

// 🔹 Admin Çıkış Yapma
const logout = (req, res) => {
    res.clearCookie("token");
    return res.json({ message: "Çıkış yapıldı" });
};

// 🟢 **Eksikse ekleyin!**
module.exports = {
    login,
    auth,
    logout,
};
