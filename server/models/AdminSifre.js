const bcrypt = require("bcryptjs");

const sifre = "admin123"; // ← Buraya istediğin şifreyi yaz

bcrypt.hash(sifre, 10).then((hash) => {
    console.log("Hash:", hash);
});
