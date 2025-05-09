const { pool } = require("./connection");

// 🟢 Stokları arama fonksiyonu
const araStok = (query, callback) => {
    const sql = `
        SELECT 
            'Urun' AS Tip, 
            U.Urun_id AS ID, 
            U.Urun_Adi AS Ad, 
            B.BedenOzellik AS Ozellik, 
            S.Stok_Miktar 
        FROM Urun_Stok S
        JOIN Urun U ON S.Urun_id = U.Urun_id
        JOIN Urun_BedenOzellik B ON S.BedenOzellik_id = B.BedenOzellik_id
        WHERE (? = 'Urun' OR ? = 'urun' OR U.Urun_Adi LIKE CONCAT('%', ?, '%') OR B.BedenOzellik LIKE CONCAT('%', ?, '%'))

        UNION ALL

        SELECT 
            'Demirbas' AS Tip, 
            D.Demirbas_id AS ID, 
            D.Demirbas_Adi AS Ad, 
            DB.BedenOzellik AS Ozellik, 
            DS.Stok_Miktar 
        FROM Demirbas_Stok DS
        JOIN Demirbas D ON DS.Demirbas_id = D.Demirbas_id
        JOIN Demirbas_BedenOzellik DB ON DS.BedenOzellik_id = DB.BedenOzellik_id
        WHERE (? = 'Demirbas' OR ? = 'demirbas' OR D.Demirbas_Adi LIKE CONCAT('%', ?, '%') OR DB.BedenOzellik LIKE CONCAT('%', ?, '%'))

        ORDER BY Tip, Ad;
    `;

    pool.query(sql, [query, query, query, query, query, query, query, query], (err, results) => {
        callback(err, results);
    });
};



module.exports = {araStok};
