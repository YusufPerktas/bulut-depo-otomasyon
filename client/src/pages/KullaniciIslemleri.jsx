import React, { useState, useEffect } from "react";
import { getKullanicilar, updateKullanici, addKullanici, deleteKullanici } from "../services/api";
import Sidebar from "../components/Sidebar";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const KullaniciIslemleri = () => {
  const [kullanicilar, setKullanicilar] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  
  useEffect(() => {
    fetchKullanicilar();
  }, []);

  const fetchKullanicilar = async () => {
    const data = await getKullanicilar();
    setKullanicilar(data);
  };

  const handleOpenModal = (user) => {
    setSelectedUser(user || { Kullanici_Adi: "", Iletisim_No: "", Meslek: "", E_Posta: "", Tarih: new Date().toISOString().split("T")[0] });
    setModalOpen(true);
    setEditMode(user ? false : true);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  const handleChange = (e) => {
    setSelectedUser({ ...selectedUser, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
    if (selectedUser.Kullanici_id) {
      await updateKullanici(selectedUser.Kullanici_id, selectedUser);
      await MySwal.fire({
        title: <span>Kullanıcı güncellendi</span>,
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        showCloseButton: true,
      });
    } else {
      await addKullanici(selectedUser);
      await MySwal.fire({
        title: <span>Yeni kullanıcı eklendi</span>,
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        showCloseButton: true,
      });
    }
    fetchKullanicilar();
    setModalOpen(false);
  } catch (error) {
    console.error("Kullanıcı işlemi hatası:", error);
    MySwal.fire({
      title: <span>Bir hata oluştu</span>,
      icon: 'error',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      showCloseButton: true,
    });
  }
};

const handleDelete = async (id) => {
  const result = await MySwal.fire({
    title: <span>Silmek istediğinize emin misiniz?</span>,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Evet, sil!',
    cancelButtonText: 'İptal',
    reverseButtons: true,
    customClass: {
      confirmButton: 'btn btn-danger',
      cancelButton: 'btn btn-secondary me-3'
    },
    buttonsStyling: false // Bu önemli: SweetAlert2'nin varsayılan stilini kapatır
  });

  if (result.isConfirmed) {
    try {
      await deleteKullanici(id);
      await MySwal.fire({
        title: <span>Kullanıcı silindi</span>,
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        showCloseButton: true,
      });
      fetchKullanicilar();
    } catch (error) {
      console.error("Silme hatası:", error);
      MySwal.fire({
        title: <span>Silme işlemi başarısız</span>,
        icon: 'error',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        showCloseButton: true,
      });
    }
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
              <div className="card p-3">
                <div className="card-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3">
                  <h3 className="h3 mb-3 mb-md-0">Kullanıcılar</h3>
                  <button className="btn btn-primary align-self-stretch align-self-md-auto" onClick={() => handleOpenModal(null)}>
                    Yeni Kullanıcı Ekle +
                  </button>
                </div>
                <div className="card-body">
                  <div className="table-responsive text-nowrap">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Kullanıcı Ad/Soyad</th>
                          <th>İletişim No</th>
                          <th>Mesleği</th>
                          <th>Tarih</th>
                          <th>Düzenle</th>
                        </tr>
                      </thead>
                      <tbody>
                        {kullanicilar.map((user, index) => (
                          <tr key={user.Kullanici_id}>
                            <td>{index + 1}</td>
                            <td>{user.Kullanici_Adi}</td>
                            <td>{user.Iletisim_No}</td>
                            <td>{user.Meslek}</td>
                            <td>{new Date(user.Tarih).toLocaleDateString()}</td>
                            <td>
                              <button className="btn btn-sm btn-info me-2" onClick={() => handleOpenModal(user)}>
                                🔍
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(user.Kullanici_id)}>
                                  🗑
                              </button>
                            </td>
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
      
      {isModalOpen && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{isEditMode ? "Kullanıcı Düzenleme" : "Kullanıcı Bilgileri"}</h5>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row g-2">
                    <div className="col-md-6">
                      <label htmlFor="userName">Kullanıcı Ad/Soyadı:</label>
                      <input type="text" className="form-control" name="Kullanici_Adi" value={selectedUser?.Kullanici_Adi || ''} readOnly={!isEditMode} onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="userContact">İletişim No:</label>
                      <input type="text" className="form-control" name="Iletisim_No" value={selectedUser?.Iletisim_No || ''} readOnly={!isEditMode} onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="userJob">Mesleği:</label>
                      <input type="text" className="form-control" name="Meslek" value={selectedUser?.Meslek || ''} readOnly={!isEditMode} onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="userEmail">E-Posta:</label>
                      <input type="email" className="form-control" name="E_Posta" value={selectedUser?.E_Posta || ''} readOnly={!isEditMode} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="col-12 text-end mt-3">
                    {!isEditMode ? (
                      <>
                        <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                          Kapat
                        </button>
                        <button type="button" className="btn btn-primary ms-2" onClick={handleEdit}>
                          Düzenle
                        </button>
                      </>
                    ) : (
                      <>
                        <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                          İptal
                        </button>
                        <button type="button" className="btn btn-primary ms-2" onClick={handleUpdate}>
                          Onayla
                        </button>
                      </>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KullaniciIslemleri;
