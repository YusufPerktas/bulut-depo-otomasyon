import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const EsyaZimmetleme = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [kullanicilarListesi, setKullanicilarListesi] = useState([]);
  const [kullanicilar, setKullanicilar] = useState([]);
  const [demirbaslar, setDemirbaslar] = useState([]);
  const [bedenler, setBedenler] = useState([]);

  const [seciliKullanici, setSeciliKullanici] = useState("");
  const [seciliDemirbas, setSeciliDemirbas] = useState("");
  const [seciliBeden, setSeciliBeden] = useState("");
  const [miktar, setMiktar] = useState("");
  const [tarih, setTarih] = useState(new Date().toISOString().slice(0, 10));
  const [activeTab, setActiveTab] = useState("zimmetleme");

  useEffect(() => {
    axios.get("http://13.61.236.139:5000/api/zimmetleme/kullanicilar")
      .then((res) => setKullanicilar(res.data))
      .catch((err) => console.error("Kullanıcılar alınamadı:", err));

    axios.get("http://13.61.236.139:5000/api/zimmetleme/demirbaslar")
      .then((res) => setDemirbaslar(res.data))
      .catch((err) => console.error("Demirbaşlar alınamadı:", err));
  }, []);

  useEffect(() => {
    if (seciliDemirbas) {
      axios.get(`http://13.61.236.139:5000/api/zimmetleme/bedenler?demirbasId=${seciliDemirbas}`)
        .then((res) => setBedenler(res.data))
        .catch((err) => console.error("Bedenler alınamadı:", err));
    } else {
      setBedenler([]);
    }
  }, [seciliDemirbas]);

  const handleZimmetle = (e) => {
    e.preventDefault();
    if (!seciliKullanici || !seciliDemirbas || !seciliBeden || !miktar || !tarih) {
      return MySwal.fire({
        title: <span>Tüm alanları doldurmalısınız</span>,
        icon: 'warning',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        showCloseButton: true,
      });
    }
  
    axios.post("http://13.61.236.139:5000/api/zimmetleme", {
      kullaniciId: seciliKullanici,
      demirbasId: seciliDemirbas,
      bedenId: seciliBeden,
      miktar: parseInt(miktar),
      tarih: tarih,
    })
      .then(() => {
        MySwal.fire({
          title: <span>Zimmetleme başarıyla yapıldı</span>,
          icon: 'success',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
          showCloseButton: true,
        });
        // 🔽 Formu sıfırla
        setSeciliKullanici("");
        setSeciliDemirbas("");
        setSeciliBeden("");
        setMiktar("");
        setTarih(new Date().toISOString().slice(0, 10));
      })
      .catch((err) => {
        console.error("Zimmetleme hatası:", err);
        MySwal.fire({
          title: <span>Zimmetleme sırasında hata oluştu</span>,
          icon: 'error',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          showCloseButton: true,
        });
      });
  };
  

  const handleTeslim = (e) => {
    e.preventDefault();
    if (!seciliKullanici || !seciliDemirbas || !seciliBeden || !miktar || !tarih) {
      return MySwal.fire({
        title: <span>Tüm alanları doldurmalısınız</span>,
        icon: 'warning',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        showCloseButton: true,
      });
    }
  
    axios.post("http://13.61.236.139:5000/api/zimmetleme/teslim", {
      kullaniciId: seciliKullanici,
      demirbasId: seciliDemirbas,
      bedenId: seciliBeden,
      miktar: parseInt(miktar),
      tarih: tarih,
    })
      .then(() => {
        MySwal.fire({
          title: <span>Teslim işlemi başarıyla tamamlandı</span>,
          icon: 'success',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
          showCloseButton: true,
        });
        // 🔽 Formu sıfırla
        setSeciliKullanici("");
        setSeciliDemirbas("");
        setSeciliBeden("");
        setMiktar("");
        setTarih(new Date().toISOString().slice(0, 10));
      })
      .catch((err) => {
        console.error("Teslim hatası:", err);
        MySwal.fire({
          title: <span>Teslim işlemi sırasında hata oluştu</span>,
          icon: 'error',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          showCloseButton: true,
        });
      });
  };
  

  useEffect(() => {
    if (searchTerm.length > 1) {
      axios.get(`http://13.61.236.139:5000/api/zimmetleme/arama?arama=${searchTerm}`)
        .then((res) => setKullanicilarListesi(res.data))
        .catch((err) => console.error("Arama hatası:", err));
    } else {
      setKullanicilarListesi([]);
    }
  }, [searchTerm]);

  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        <Sidebar />
        <div className="layout-page">
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
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

              <div className="card mb-4 mx-3">
                <div className="card-body">
                  <h3 className="mb-3">Kullanıcı Zimmet Arama</h3>
                  <div className="input-group input-group-merge">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ad veya demirbaş giriniz..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="input-group-text">
                      <i className="bx bx-search"></i>
                    </span>
                  </div>
                  {kullanicilarListesi.length > 0 && (
                    <table className="table table-bordered mt-3">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Kullanıcı</th>
                          <th>Demirbaş</th>
                          <th>Beden</th>
                          <th>Miktar</th>
                          <th>Tarih</th>
                        </tr>
                      </thead>
                      <tbody>
                        {kullanicilarListesi.map((item, i) => (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{item.kullaniciAdi}</td>
                            <td>{item.demirbasAdi}</td>
                            <td>{item.bedenOzellik}</td>
                            <td>{item.stokMiktari}</td>
                            <td>{new Date(item.tarih).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              <div className="card mb-4 mx-3 p-3">
                <h3 className="mb-3">Zimmetleme İşlemleri</h3>
                <ul className="nav nav-pills mb-3">
                  <li className="nav-item">
                    <button className={`nav-link ${activeTab === "zimmetleme" ? "active" : ""}`} onClick={() => setActiveTab("zimmetleme")}>
                      Eşya Zimmetleme
                    </button>
                  </li>
                  <li className="nav-item">
                    <button className={`nav-link ${activeTab === "teslim" ? "active" : ""}`} onClick={() => setActiveTab("teslim")}>
                      Eşya Teslim
                    </button>
                  </li>
                </ul>

                {/* Zimmetleme Formu */}
                {activeTab === "zimmetleme" && (
                  <form onSubmit={handleZimmetle}>
                    <div className="row g-2">
                      <div className="col-md-6">
                        <label>Kullanıcı:</label>
                        <select className="form-select" value={seciliKullanici} onChange={(e) => setSeciliKullanici(e.target.value)}>
                          <option value="">Seçiniz...</option>
                          {kullanicilar.map((k) => (
                            <option key={k.Kullanici_id} value={k.Kullanici_id}>{k.Kullanici_Adi}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label>Demirbaş:</label>
                        <select className="form-select" value={seciliDemirbas} onChange={(e) => setSeciliDemirbas(e.target.value)}>
                          <option value="">Seçiniz...</option>
                          {demirbaslar.map((d) => (
                            <option key={d.Demirbas_id} value={d.Demirbas_id}>{d.Demirbas_Adi}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label>Beden/Özellik:</label>
                        <select className="form-select" value={seciliBeden} onChange={(e) => setSeciliBeden(e.target.value)}>
                          <option value="">Seçiniz...</option>
                          {bedenler.map((b) => (
                            <option key={b.BedenOzellik_id} value={b.BedenOzellik_id}>{b.BedenOzellik}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-3">
                        <label>Miktar:</label>
                        <input type="number" className="form-control" value={miktar} onChange={(e) => setMiktar(e.target.value)} />
                      </div>
                      <div className="col-md-3">
                        <label>Tarih:</label>
                        <input type="date" className="form-control" value={tarih} onChange={(e) => setTarih(e.target.value)} />
                      </div>
                      <div className="col-12 text-end mt-3">
                        <button type="submit" className="btn btn-primary">Zimmetle</button>
                      </div>
                    </div>
                  </form>
                )}

                {/* Teslim Formu */}
                {activeTab === "teslim" && (
                  <form onSubmit={handleTeslim}>
                    <div className="row g-2">
                      <div className="col-md-6">
                        <label>Kullanıcı:</label>
                        <select className="form-select" value={seciliKullanici} onChange={(e) => setSeciliKullanici(e.target.value)}>
                          <option value="">Seçiniz...</option>
                          {kullanicilar.map((k) => (
                            <option key={k.Kullanici_id} value={k.Kullanici_id}>{k.Kullanici_Adi}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label>Demirbaş:</label>
                        <select className="form-select" value={seciliDemirbas} onChange={(e) => setSeciliDemirbas(e.target.value)}>
                          <option value="">Seçiniz...</option>
                          {demirbaslar.map((d) => (
                            <option key={d.Demirbas_id} value={d.Demirbas_id}>{d.Demirbas_Adi}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label>Beden/Özellik:</label>
                        <select className="form-select" value={seciliBeden} onChange={(e) => setSeciliBeden(e.target.value)}>
                          <option value="">Seçiniz...</option>
                          {bedenler.map((b) => (
                            <option key={b.BedenOzellik_id} value={b.BedenOzellik_id}>{b.BedenOzellik}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-3">
                        <label>Miktar:</label>
                        <input type="number" className="form-control" value={miktar} onChange={(e) => setMiktar(e.target.value)} />
                      </div>
                      <div className="col-md-3">
                        <label>Tarih:</label>
                        <input type="date" className="form-control" value={tarih} onChange={(e) => setTarih(e.target.value)} />
                      </div>
                      <div className="col-12 text-end mt-3">
                        <button type="submit" className="btn btn-success">Teslim Et</button>
                      </div>
                    </div>
                  </form>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EsyaZimmetleme;
