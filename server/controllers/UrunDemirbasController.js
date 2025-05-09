const UrunDemirbasTablo = require("../models/UrunDemirbasTablo");

exports.getAllProductsAndAssets = (req, res) => {
  UrunDemirbasTablo.getAll((err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
};

