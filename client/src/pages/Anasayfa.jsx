import React from "react";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import {searchStock,
  stokGuncelle, 
  getProductsByCategory, 
  getSizesByProduct,} from "../services/api";
  import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);


const Anasayfa = () => {
  const [query, setQuery] = useState("");
  const [stoklar, setStoklar] = useState([]);
  const [karZarar, setKarZarar] = useState("...");
  const [cokSatilanlar, setCokSatilanlar] = useState([]);
  const [azStokUrunler, setAzStokUrunler] = useState([]);
  const [azStokDemirbaslar, setAzStokDemirbaslar] = useState([]);


  // STOK İŞLEMLERİ
  const [activeTab, setActiveTab] = useState("ekle"); // Seçili işlem (Ekle / Çıkart)
  const [kategori, setKategori] = useState("");
  const [urunler, setUrunler] = useState([]);
  const [urunId, setUrunId] = useState("");
  const [bedenler, setBedenler] = useState([]);
  const [bedenId, setBedenId] = useState("");
  const [miktar, setMiktar] = useState("");
  const [fiyat, setFiyat] = useState("");
  const [tarih, setTarih] = useState("");
  const [isSaleDisabled, setIsSaleDisabled] = useState(false); // ✅ Satış fiyatı girişini kontrol eden state

  const handleSearch = async (e) => {
    const searchTerm = e.target.value;
    setQuery(searchTerm);
    setStoklar([]);
    if (searchTerm.trim() !== "") {
      const results = await searchStock(searchTerm);
      setStoklar(results);
    }
  };

  useEffect(() => {
    axios.get("http://localhost:5000/api/kart/kar-zarar").then((res) => setKarZarar(res.data.karZarar));
    axios.get("http://localhost:5000/api/kart/en-cok-satilan").then((res) => setCokSatilanlar(res.data.urunler));
    axios.get("http://localhost:5000/api/kart/en-az-stok-urun").then((res) => setAzStokUrunler(res.data.urunler));
    axios.get("http://localhost:5000/api/kart/en-az-stok-demirbas").then((res) => setAzStokDemirbaslar(res.data.demirbaslar));
  }, []);

  const renderList = (list, labelKey = "urunAdi") => (
    list.map((item, index) => (
      <div key={index} className="d-flex align-items-center mb-1">
        <span className="badge bg-label-primary rounded-pill me-2">{index + 1}</span>
        <span>{item[labelKey]}{item.stok !== undefined && ` - ${item.stok} adet`}</span>
      </div>
    ))
  );

  // ✅ Kategori değiştiğinde ilgili ürünleri getir
  useEffect(() => {
    if (kategori) {
      getProductsByCategory(kategori).then(setUrunler);
      setUrunId("");    // ✅ Ürün sıfırla
      setBedenId("");   // ✅ Beden sıfırla
      setBedenler([]);  // ✅ Beden listesini temizle
    }
  }, [kategori]);

  // ✅ Ürün değiştiğinde ilgili bedenleri getir
  useEffect(() => {
    if (urunId) {
      getSizesByProduct(kategori, urunId).then(setBedenler);
      setBedenId(""); // ✅ Beden sıfırla
    } else {
      setBedenler([]); 
    }
  }, [urunId]);
  
  // ✅ Kategori ve işlem türüne göre satış fiyatı alanını devre dışı bırakma
  useEffect(() => {
    if (activeTab === "cikar" && kategori === "Demirbaş") {
        setIsSaleDisabled(true);
        setFiyat(""); // **Satış fiyatı alanı devre dışı olduğunda sıfırlıyoruz**
    } else {
        setIsSaleDisabled(false);
    }
  }, [activeTab, kategori]);

  // ✅ Stok Güncelleme Fonksiyonu
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!kategori || !urunId || !bedenId || !miktar || (!isSaleDisabled && !fiyat) || !tarih) {
      alert("Lütfen tüm alanları doldurun!");
      return MySwal.fire({
        title: <span>Lütfen tüm alanları doldurun!</span>,
        icon: 'warning',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        showCloseButton: true,
      });
    }
  
    const stokVerisi = {
      category: kategori,
      productId: urunId,
      sizeId: bedenId,
      quantity: Number(miktar),
      price: isSaleDisabled ? null : Number(fiyat),
      transactionType: activeTab,
      date: tarih
    };
  
    try {
      const response = await stokGuncelle(stokVerisi);
      await MySwal.fire({
        title: <span>{response.message}</span>,
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        showCloseButton: true,
      });
  
      // 🔽 Tüm form alanlarını sıfırla
      setKategori("");
      setUrunler([]);
      setUrunId("");
      setBedenler([]);
      setBedenId("");
      setFiyat("");
      setMiktar("");
      setTarih("");
    } catch (error) {
      MySwal.fire({
        title: <span>Stok güncellenirken hata oluştu.</span>,
        icon: 'error',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        showCloseButton: true,
      });
    }
  };
  

  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        {/* Sidebar Component */}
        <Sidebar />

        {/* Layout Page */}
        <div className="layout-page">
          {/* Content Wrapper */}
          <div className="content-wrapper">
            {/* Content */}
            <div className="container-xxl flex-grow-1 container-p-y">
              {/* Menü Açma Butonu (Mobil İçin) */}
              <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
                <a className="nav-item nav-link px-0 me-xl-4" href="#" onClick={(e) => {e.preventDefault();
                  document.documentElement.classList.toggle("layout-menu-expanded");}}>
                  <i className="bx bx-menu bx-sm"></i>
                </a>
              </div>

              {/* Dashboard Kartları */}
              <div className="row">
                    {/* Kart 1 - Toplam Kar/Zarar */}
                    <div className="col-lg-3 col-md-6 col-sm-6 mb-4">
                      <div className="card h-100 shadow-sm">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <div className="avatar bg-label-success rounded">
                              <img src="/assets/img/icons/unicons/wallet.png" className="rounded" height={28} alt="Profit" />
                            </div>
                          </div>
                          <span className="fw-semibold d-block text-muted mb-3">Toplam Kar / Zarar</span>
                          <div className="border-top mb-2"></div>
                          <h3 className={`card-title mb-2 ${karZarar >= 0 ? "text-success" : "text-danger"}`}>{karZarar} TL</h3>
                          
                        </div>
                      </div>
                    </div>

                    {/* Kart 2 - En Çok Satılan Ürünler */}
                    <div className="col-lg-3 col-md-6 col-sm-6 mb-4">
                      <div className="card h-100 shadow-sm">
                        <div className="card-body">
                          <div className="avatar bg-label-success rounded mb-2">
                            <img src="/assets/img/icons/unicons/chart-success.png" className="rounded" height={28} alt="Sales" />
                          </div>
                          <span className="fw-semibold d-block text-muted mb-1">En Çok Satılan Ürünler</span>
                          {cokSatilanlar.map((urun, index) => (
                            <div key={index} className="d-flex align-items-center mb-1">
                              <span className="badge bg-label-primary rounded-pill me-2">{index + 1}</span>
                              <span>{urun}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Kart 3 - En Az Stoğu Olan Ürünler */}
                    <div className="col-lg-3 col-md-6 col-sm-6 mb-4">
                      <div className="card h-100 shadow-sm">
                        <div className="card-body">
                          <div className="avatar bg-label-danger rounded mb-2">
                          <img src="/assets/img/icons/unicons/warning-icon.png" alt="AzStokUrun" height="28" />

                          </div>
                          <span className="fw-semibold d-block text-muted mb-1">En Az Stoğu Olan Ürünler</span>
                          {renderList(azStokUrunler)}
                        </div>
                      </div>
                    </div>

                    {/* Kart 4 - En Az Stoğu Olan Demirbaşlar */}
                    <div className="col-lg-3 col-md-6 col-sm-6 mb-4">
                      <div className="card h-100 shadow-sm">
                        <div className="card-body">
                          <div className="avatar bg-label-danger rounded mb-2">
                            <img src="/assets/img/icons/unicons/warning-icon.png" className="rounded" height={28} alt="AzStokDemirbaş" />
                          </div>
                          <span className="fw-semibold d-block text-muted mb-1">En Az Stoğu Olan Demirbaşlar</span>
                          {renderList(azStokDemirbaslar, "demirbasAdi")}
                        </div>
                      </div>
                    </div>

                  </div>

              {/* Depo Arama & Tablo */}
              <div className="card mb-4 mx-3">
                <div className="card-body demo-vertical-spacing demo-only-element">
                  <h3 className="text-start mb-3">Stok Arama</h3>
                  <div className="input-group input-group-merge">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Ürün veya kategori ara..."
                        aria-label="Search"
                        value={query}
                        onChange={handleSearch}
                    />
                    <span className="input-group-text"><i className="bx bx-search"></i></span>
                  </div>
                  {/* Stok Tablosu */}
                  {stoklar.length > 0 && (
                    <div className="table-responsive text-nowrap mt-3">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Kategori</th>
                                    <th>Ürün/Demirbaş Adı</th>
                                    <th>Beden/Özellik</th>
                                    <th>Stok Bilgisi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stoklar.map((stok, index) => (
                                    <tr key={`${stok.Tip}-${stok.Ozellik}`}>
                                        <td>{index + 1}</td>
                                        <td>{stok.Tip}</td>
                                        <td>{stok.Ad}</td>
                                        <td>{stok.Ozellik || "-"}</td>
                                        <td>{stok.Stok_Miktar !== null ? stok.Stok_Miktar : "0"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                 )}
                </div>
              </div>
              {/* Stok İşlemleri */}
              <div className="card mb-4 mx-3 p-4">
                <h3 className="text-start mb-3">Stok İşlemleri</h3>
                <ul className="nav nav-pills">
                  <li className="nav-item">
                    <button className={`nav-link ${activeTab === "ekle" ? "active" : ""}`}
                            onClick={() => setActiveTab("ekle")}>Stok Ekle</button>
                  </li>
                  <li className="nav-item">
                    <button className={`nav-link ${activeTab === "cikar" ? "active" : ""}`}
                            onClick={() => setActiveTab("cikar")}>Stok Çıkart</button>
                  </li>
                </ul>
                <div className="tab-content mt-3">
                  <form onSubmit={handleSubmit}>
                    <div className="row g-2 mt-2">
                      <div className="col-md-6">
                        <label>Tarih:</label>
                        <input type="date" className="form-control" value={tarih} onChange={(e) => setTarih(e.target.value)} />
                      </div>
                      <div className="col-md-6">
                        <label>Kategori:</label>
                        <select className="form-select" value={kategori} onChange={(e) => setKategori(e.target.value)}>
                          <option value="">--Seçiniz--</option>
                          <option value="Demirbaş">Demirbaş</option>
                          <option value="Ürün">Ürün</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label>Ürün/Demirbaş Adı:</label>
                        <select className="form-select" value={urunId} onChange={(e) => setUrunId(e.target.value)} disabled={!kategori}>
                          <option value="">--Seçiniz--</option>
                          {urunler.map((urun) => (
                            <option key={urun.id} value={urun.id}>{urun.adi}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label>Özellik/Beden:</label>
                        <select className="form-select" value={bedenId} onChange={(e) => setBedenId(e.target.value)} disabled={!urunId}>
                          <option value="">--Seçiniz--</option>
                          {bedenler.map((beden) => (
                            <option key={beden.id} value={beden.id}>{beden.beden}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label>{activeTab === "ekle" ? "Maliyet Fiyatı" : "Satış Fiyatı"}:</label>
                        <input type="number" className="form-control" value={fiyat} 
                                             onChange={(e) => setFiyat(e.target.value)}
                                             disabled={isSaleDisabled} // ✅ Demirbaşsa devre dışı 
                        /> 
                      </div>
                      <div className="col-md-6">
                        <label>Miktar:</label>
                        <input type="number" className="form-control" value={miktar} onChange={(e) => setMiktar(e.target.value)} />
                      </div>
                      <div className="col-12 text-end">
                        <button className="btn btn-primary">Onayla</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            {/* Content Wrapper End */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Anasayfa;
