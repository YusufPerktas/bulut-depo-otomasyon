import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { insertNewProductOrAsset } from "../services/api";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const UrunDemirbasKayit = () => {
  const [kategori, setKategori] = useState("");
  const [urunAdi, setUrunAdi] = useState("");
  const [tarih, setTarih] = useState("");
  const [stoklar, setStoklar] = useState([]);
  const navigate = useNavigate();

  // Stok Ekleme Fonksiyonu
  const stokEkle = () => {
    setStoklar([...stoklar, { beden: "", stokMiktari: "", maliyet: "" }]);
  };

  // Stok alanında değişiklik yapıldığında
  const stokDegistir = (index, field, value) => {
    const yeniStoklar = [...stoklar];
    yeniStoklar[index][field] = value;
    setStoklar(yeniStoklar);
  };

  // Form Gönderme İşlemi
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (stoklar.length === 0) {
      MySwal.fire({
        icon: 'warning',
        title: 'En az bir stok alanı eklenmelidir!',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        showCloseButton: true,
      });
      return;
    }
  
    try {
      await insertNewProductOrAsset({ kategori, urunAdi, tarih, stoklar });
      MySwal.fire({
        icon: 'success',
        title: 'Ürün başarıyla eklendi!',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        showCloseButton: true,
      });
  
      // 🔽 STATE'LERİ TEMİZLE
      setKategori("");
      setUrunAdi("");
      setTarih("");
      setStoklar([]);
  
      navigate("/UrunDemirbas");
    } catch (error) {
      MySwal.fire({
        icon: 'error',
        title: 'Ürün eklenirken hata oluştu!',
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
        <Sidebar />

        <div className="layout-page">
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              {/* Menü Açma Butonu (Mobil İçin) */}
              <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
                <a className="nav-item nav-link px-0 me-xl-4" href="#" onClick={(e) => {e.preventDefault();
                  document.documentElement.classList.toggle("layout-menu-expanded");}}>
                  <i className="bx bx-menu bx-sm"></i>
                </a>
              </div>

              {/* Ürün Kayıt Formu */}
              <div className="card p-4">
                <div className="card-header">
                  <h3 className="h3">Ürün/Demirbaş Kayıt</h3>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label>Kategori:</label>
                      <select className="form-select" value={kategori} onChange={(e) => setKategori(e.target.value)}>
                        <option value="">--Seçiniz--</option>
                        <option value="Demirbaş">Demirbaş</option>
                        <option value="Ürün">Ürün</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label>Ürün Adı:</label>
                      <input type="text" className="form-control" value={urunAdi} onChange={(e) => setUrunAdi(e.target.value)} />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Tarih:</label>
                      <input type="date" className="form-control" value={tarih} onChange={(e) => setTarih(e.target.value)} />
                    </div>
                  </div>

                  <hr />
                  <div className="card-header">
                    <h4 className="h4">Stok Ekleme</h4>
                  </div>
                  
                  {/* Ekle+ Butonu */}
                  <button type="button" className="btn btn-success mb-3" onClick={stokEkle}>
                    Ekle +
                  </button>

                  {/* Dinamik Stok Alanları */}
                  {stoklar.map((stok, index) => (
                    <div key={index} className="border p-3 mb-2 rounded">
                      <div className="row">
                        <div className="col-md-4">
                          <label>Beden:</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={stok.beden} 
                            onChange={(e) => stokDegistir(index, "beden", e.target.value)} 
                          />
                        </div>
                        <div className="col-md-4">
                          <label>Stok Miktarı:</label>
                          <input 
                            type="number" 
                            className="form-control" 
                            value={stok.stokMiktari} 
                            onChange={(e) => stokDegistir(index, "stokMiktari", e.target.value)} 
                          />
                        </div>
                        <div className="col-md-4">
                          <label>Maliyet:</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={stok.maliyet} 
                            onChange={(e) => stokDegistir(index, "maliyet", e.target.value)} 
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="text-end mt-3">
                    <button type="submit" className="btn btn-primary">Kaydet</button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrunDemirbasKayit;
