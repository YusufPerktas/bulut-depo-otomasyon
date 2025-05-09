import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const Raporlar = () => {
  const [enCokSatanlar, setEnCokSatanlar] = useState([]);
  const [stokVeSatis, setStokVeSatis] = useState([]);
  const [performans, setPerformans] = useState([]);

  useEffect(() => {
    axios.get("http://13.49.224.225:5000/api/raporlar/en-cok-satanlar")
      .then((res) => setEnCokSatanlar(res.data))
      .catch((err) => {
        console.error("En çok satanlar alınamadı:", err);
        MySwal.fire({
          title: <span>"En çok satanlar alınamadı"</span>,
          icon: 'error',
          toast: true,
          position: 'top-end',
          timer: 2000,
          showCloseButton: true,
          showConfirmButton: false,
        });
      });

    axios.get("http://13.49.224.225:5000/api/raporlar/stok-satis")
      .then((res) => setStokVeSatis(res.data))
      .catch((err) => {
        console.error("Stok-satış alınamadı:", err);
        MySwal.fire({
          title: <span>"Stok-satış verileri alınamadı"</span>,
          icon: 'error',
          toast: true,
          position: 'top-end',
          timer: 2000,
          showCloseButton: true,
          showConfirmButton: false,
        });
      });

    axios.get("http://13.49.224.225:5000/api/raporlar/performans")
      .then((res) => setPerformans(res.data))
      .catch((err) => {
        console.error("Performans alınamadı:", err);
        MySwal.fire({
          title: <span>"Satış performansı alınamadı"</span>,
          icon: 'error',
          toast: true,
          position: 'top-end',
          timer: 2000,
          showCloseButton: true,
          showConfirmButton: false,
        });
      });
  }, []);

  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        <Sidebar />
        <div className="layout-page">
          <div className="content-wrapper">
            <div className="container-fluid py-4">

                            {/* Menü Açma Butonu (Mobil İçin) */}
                            <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
                <a className="nav-item nav-link px-0 me-xl-4" href="#" onClick={(e) => {e.preventDefault();
                  document.documentElement.classList.toggle("layout-menu-expanded");}}>
                  <i className="bx bx-menu bx-sm"></i>
                </a>
              </div>

              {/* En Çok Satılan Ürünler */}
              <div className="card mb-4 p-3">
                <h3 className="mb-3">📦 En Çok Satılan Ürünler</h3>
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Ürün Adı</th>
                        <th>Satış Miktarı</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enCokSatanlar.map((item, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{item.Urun_Adi}</td>
                          <td>{item.ToplamSatis}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Ürün Başına Stok vs Satış */}
              <div className="card mb-4 p-3">
                <h3 className="mb-3">📊 Ürün Bazlı Stok ve Satış</h3>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Ürün Adı</th>
                        <th>Toplam Alınan Stok</th>
                        <th>Toplam Satılan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stokVeSatis.map((item, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{item.Urun_Adi}</td>
                          <td>{item.ToplamAlim}</td>
                          <td>{item.ToplamSatis}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Satış Performansı */}
              <div className="card mb-4 p-3">
                <h3 className="mb-3">💹 Satış Performansı</h3>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Ürün Adı</th>
                        <th>Toplam Maliyet (₺)</th>
                        <th>Toplam Satış (₺)</th>
                        <th>Kazanç (₺)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {performans.map((item, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{item.Urun_Adi}</td>
                          <td>{Number(item.ToplamMaliyet || 0).toFixed(2)}</td>
                          <td>{Number(item.ToplamSatisTutar || 0).toFixed(2)}</td>
                          <td>{Number((item.ToplamSatisTutar - item.ToplamMaliyet) || 0).toFixed(2)}</td>
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

export default Raporlar;
