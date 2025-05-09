const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const stokRoutes = require('./routers/stoklar');
const adminRoutes = require('./routers/admin');
const urunDemirbasRoutes = require("./routers/urunDemirbas");
const urunDemirbasKayitRoutes = require("./routers/urunDemirbasKayit");
const kullaniciRoutes = require("./routers/KullaniciRouter");
const kartRoutes = require("./routers/KartRouter");
const stokislemleri = require("./routers/StokIslemleri");
const zimmetlemeRouter = require("./routers/zimmetlemeRouter");
const raporlarRouter = require("./routers/raporlarRouter");

app.use(cors({
    origin: ['http://localhost:3000', 'http://depo-frontend.s3-website.eu-north-1.amazonaws.com'],
    credentials: true,}
));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Form verilerini işlemek için
app.use(cookieParser());

// API Routers
app.use('/api/stoklar', stokRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/urun-demirbas', urunDemirbasRoutes);
app.use("/api/urun-demirbas-kayit", urunDemirbasKayitRoutes);
app.use("/api/kullanici", kullaniciRoutes);
app.use("/api/kart", kartRoutes);
app.use("/api/stok-islemleri", stokislemleri);
app.use("/api/zimmetleme", zimmetlemeRouter);
app.use("/api/raporlar", raporlarRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

