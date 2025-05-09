import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../services/api";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const menuItems = [
  { name: "Anasayfa", path: "/Anasayfa", icon: "bx bx-home-circle" },
  { name: "Ürün/Malzeme İşlemleri", path: "/UrunDemirbas", icon: "bx bx-collection" },
  { name: "Kullanıcı İşlemleri", path: "/KullaniciIslemleri", icon: "bx bx-user" },
  { name: "Eşya Zimmetleme", path: "/EsyaZimmetleme", icon: "bx bx-id-card" },
  { name: "Raporlar", path: "/Raporlar", icon: "bx bx-line-chart" },
  { name: "Geçmiş İşlemler", path: "/StokIslemleri", icon: "bx bx-history" },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      MySwal.fire({
        icon: "success",
        title: "Başarıyla çıkış yapıldı.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
        showCloseButton: true,
      });
      navigate("/login");
    } catch (error) {
      console.error("Çıkış işlemi başarısız!");
      MySwal.fire({
        icon: "error",
        title: "Çıkış işlemi başarısız!",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        showCloseButton: true,
      });
    }
  };

  return (
    <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme">
      <div className="app-brand demo">
        <Link to="/Anasayfa" className="app-brand-link">
          <span className="app-brand-logo">
            <img src="/assets/img/icons/brands/asana.png" alt="Logo" width="25" />
          </span>
          <span className="app-brand-text demo menu-text fw-bolder ms-2">Depo</span>
        </Link>
        {/* Menü Kapatma Butonu (Mobil İçin) */}
        <a href="#" className="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none"
          onClick={(e) => {e.preventDefault(); document.documentElement.classList.remove("layout-menu-expanded");}}>
          <i className="bx bx-chevron-left bx-sm align-middle"></i>
        </a>
      </div>

      <hr className="border-light my-0" />

      <div className="menu-inner-shadow"></div>

      <ul className="menu-inner py-1">
        {menuItems.map((item, index) => (
          <li key={index} className={`menu-item ${location.pathname === item.path ? "active" : ""}`}>
            <Link to={item.path} className="menu-link">
              <i className={`menu-icon tf-icons ${item.icon}`}></i>
              <div>{item.name}</div>
            </Link>
          </li>
        ))}
      </ul>
      {/* Çıkış Butonu */}
      <div className="menu-footer">
        <div className="m-3">
          <button className="btn btn-danger w-100" onClick={handleLogout}>
            <i className="bx bx-log-out"></i> Güvenli Çıkış 
          </button> {/* className="bx bx-power-off" */}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
