const UrunDemirbasKayitModel = require("../models/UrunDemirbasKayitModel");

const insertProductOrAsset = async (req, res) => {
    try {
        const result = await UrunDemirbasKayitModel.insertProductOrAsset(
            req.body.kategori, req.body.urunAdi, req.body.tarih, req.body.stoklar
        );
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { insertProductOrAsset };
