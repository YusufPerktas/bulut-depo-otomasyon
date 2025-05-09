import axios from "axios";

const API_BASE_URL = "http://13.49.224.225:5000/api"; // Backend API URL
const STOK_API_URL = `${API_BASE_URL}/stoklar`;
const ADMIN_API_URL = `${API_BASE_URL}/admin`;
const URUN_DEMIRBAS_API_URL = `${API_BASE_URL}/urun-demirbas`;
const URUN_DEMIRBAS__KAYIT_API_URL = `${API_BASE_URL}/urun-demirbas-kayit`;
const KULLANICI_API_URL = `${API_BASE_URL}/kullanici`;

// 🟢 Stok Arama
export const searchStock = async (query) => {
    try {
        const response = await axios.get(`${STOK_API_URL}/ara?q=${query}`);
        return response.data;
    } catch (error) {
        console.error("Stok verileri alınamadı:", error);
        return [];
    }
};

// 🟢 Stok Güncelleme
export const stokGuncelle = async (stokVerisi) => {
    try {
        const response = await axios.post(`${STOK_API_URL}/guncelle`, stokVerisi);
        return response.data;
    } catch (error) {
        console.error("Stok güncelleme hatası:", error.response?.data || error.message);
        throw error;
    }
};

// 🟢 Kategoriye Göre Ürün Getirme
export const getProductsByCategory = async (category) => {
    try {
        const response = await axios.get(`${STOK_API_URL}/category/${category}`);
        return response.data;
    } catch (error) {
        console.error("Ürünleri getirme hatası:", error.response?.data || error.message);
        return [];
    }
};

// 🟢 Ürüne Göre Beden/Özellik Getirme
export const getSizesByProduct = async (category, productId) => {
    try {
        const response = await axios.get(`${STOK_API_URL}/size/${category}/${productId}`);
        return response.data;
    } catch (error) {
        console.error("Bedenleri getirme hatası:", error.response?.data || error.message);
        return [];
    }
};

// 🔹 **🔐 LOGIN (Giriş Yapma)**
export const login = async (credentials) => {
    try {
        const response = await axios.post(`${ADMIN_API_URL}/login`, credentials, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Giriş hatası:", error.response?.data || error.message);
        throw error;
    }
};

// 🔹 **✅ AUTH CHECK (Kullanıcı Giriş Yapmış mı?)**
export const checkAuth = async () => {
    try {
        const response = await axios.get(`${ADMIN_API_URL}/auth`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Yetkilendirme hatası:", error.response?.data || error.message);
        throw error;
    }
};

// 🔹 **🚪 LOGOUT (Güvenli Çıkış Yapma)**
export const logout = async () => {
    try {
        const response = await axios.post(`${ADMIN_API_URL}/logout`, {}, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Çıkış hatası:", error.response?.data || error.message);
        throw error;
    }
};

// 🟢 Ürün ve Demirbaşları Getir
export const getAllProductsAndAssets = async () => {
    try {
        const response = await axios.get(`${URUN_DEMIRBAS_API_URL}/urunler-ve-demirbaslar`);
        return response.data;
    } catch (error) {
        console.error("Veri çekme hatası:", error);
        return [];
    }
};

// 🟢 Yeni Ürün/Demirbaş Ekleme 
export const insertNewProductOrAsset = async (urunVerisi) => {
    try {
        const response = await axios.post(`${URUN_DEMIRBAS__KAYIT_API_URL}/ekle`, urunVerisi);
        return response.data;
    } catch (error) {
        console.error("Ürün ekleme hatası:", error.response?.data || error.message);
        throw error;
    }
};


// 🟢 Kullanıcıları Getirme
export const getKullanicilar = async () => {
    try {
        const response = await axios.get(`${KULLANICI_API_URL}/kullanici-getir`);
        return response.data;
    } catch (error) {
        console.error("Kullanıcıları çekerken hata oluştu:", error);
        return [];
    }
};

// 🟡 Kullanıcı Güncelleme
export const updateKullanici = async (id, data) => {
    try {
        await axios.post(`${KULLANICI_API_URL}/kullanici-guncelle/${id}`, data);
        return true;
    } catch (error) {
        console.error("Kullanıcı güncellenirken hata oluştu:", error);
        return false;
    }
};

// 🔴 Yeni Kullanıcı Ekleme
export const addKullanici = async (data) => {
    try {
        await axios.post(`${KULLANICI_API_URL}/kullanici-ekle`, data);
        return true;
    } catch (error) {
        console.error("Kullanıcı eklerken hata oluştu:", error);
        return false;
    }
};

// Kullanıcı silme
export const deleteKullanici = async (id) => {
    const response = await axios.delete(`/api/kullanicilar/${id}`);
    return response.data;
  };

