import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getAllProductsAndAssets } from "../services/api";

const UrunDemirbas = () => {
  const [urunler, setUrunler] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllProductsAndAssets().then(setUrunler);
  }, []);

  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        <Sidebar />

        <div className="layout-page">
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              {/* Menü Açma Butonu (Mobil İçin) */}
              <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
                <a
                  className="nav-item nav-link px-0 me-xl-4"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    document.documentElement.classList.toggle("layout-menu-expanded");
                  }}
                >
                  <i className="bx bx-menu bx-sm"></i>
                </a>
              </div>

              {/* Ürün ve Demirbaş Listesi */}
              <div className="card p-3">
                <div className="card-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3">
                  <h3 className="h5 mb-3 mb-md-0">Ürün ve Demirbaş Listesi</h3>
                  <button
                    className="btn btn-primary align-self-stretch align-self-md-auto"
                    onClick={() => navigate("/UrunDemirbasKayit")}
                  >
                    ÜRÜN/DEMİRBAŞ KAYIT ➝
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Kategori</th>
                        <th>Ürün/Demirbaş Adı</th>
                        <th>Tarih</th>
                      </tr>
                    </thead>
                    <tbody>
                      {urunler.map((urun, index) => (
                        <tr key={urun.id}>
                          <td>{index + 1}</td>
                          <td>{urun.kategori}</td>
                          <td>{urun.ad}</td>
                          <td>{new Date(urun.Tarih).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrunDemirbas;
