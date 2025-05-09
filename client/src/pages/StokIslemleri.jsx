import axios from 'axios';
import { useEffect, useState } from 'react';
import Sidebar from "../components/Sidebar";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const StokIslemleri = () => {
    
    const [activeTab, setActiveTab] = useState('urun');
    const [urunIslemleri, setUrunIslemleri] = useState([]);
    const [demirbasIslemleri, setDemirbasIslemleri] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIslemler = async () => {
          try {
            const [urunRes, demirbasRes] = await Promise.all([
              axios.get('http://localhost:5000/api/stok-islemleri/urun'),
              axios.get('http://localhost:5000/api/stok-islemleri/demirbas')
            ]);
            setUrunIslemleri(urunRes.data);
            setDemirbasIslemleri(demirbasRes.data);
            setLoading(false);
          } catch (error) {
            console.error("Veriler alınırken hata oluştu:", error);
            MySwal.fire({
              title: <span>"Stok işlemleri verileri alınamadı"</span>,
              icon: 'error',
              toast: true,
              position: 'top-end',
              timer: 2000,
              showCloseButton: true,
              showConfirmButton: false,
            });
          }
        };
    
        fetchIslemler();
      }, []);

      const renderTable = (data, isDemirbas = false) => (
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Adı</th>
                <th className="p-2 border">Beden / Özellik</th>
                <th className="p-2 border">Miktar</th>
                <th className="p-2 border">Fiyat</th>
                <th className="p-2 border">İşlem</th>
                <th className="p-2 border">Tarih</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-4">Veri bulunamadı.</td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-2 border">{item.adi}</td>
                    <td className="p-2 border">{item.bedenOzellik}</td>
                    <td className="p-2 border">{item.miktar}</td>
                    <td className="p-2 border">{item.fiyat !== null ? `${item.fiyat} ₺` : '-'}</td>
                    <td className="p-2 border">{item.islem}</td>
                    <td className="p-2 border">{new Date(item.tarih).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      );

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
  
                <div className="p-4 border rounded bg-white shadow-sm mb-4">
              <h2 className="text-2xl font-semibold mb-4">Stok İşlemleri</h2>

              <div className="flex space-x-4">
                <button
                  className={`px-4 py-2 rounded ${activeTab === 'urun' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                  onClick={() => setActiveTab('urun')}
                >
                  Ürün İşlemleri
                </button>
                <button
                  className={`px-4 py-2 rounded ${activeTab === 'demirbas' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                  onClick={() => setActiveTab('demirbas')}
                >
                  Demirbaş İşlemleri
                </button>
              </div>

              {loading ? (
                <div className="mt-4">Yükleniyor...</div>
              ) : activeTab === 'urun' ? (
                renderTable(urunIslemleri)
              ) : (
                renderTable(demirbasIslemleri, true)
              )}
            </div>
              {/* Content Wrapper End */}
            </div>
          </div>
        </div>
      </div>
    </div>

    );
};

export default StokIslemleri;
