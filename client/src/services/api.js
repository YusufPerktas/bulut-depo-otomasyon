import axios from "axios";

// 📌 Global Axios Instance
const api = axios.create({
    baseURL: "http://13.49.224.225:5000/api",
    withCredentials: true
});

// 🟢 Stok Arama
export const searchStock = async (query) => {
    try {
        const response = await api.get(`/stoklar/ara?q=${query}`);
        return response.data;
    } catch (error) {
        console.error("Stok verileri alınamadı:", error);
        return [];
    }
};

// 🟢 Stok Güncelleme
export const stokGuncelle = async (stokVerisi) => {
    try {
        const response = await api.post("/stoklar/guncelle", stokVerisi);
        return response.data;
    } catch (error) {
        console.error("Stok güncelleme hatası:", error);
        throw error;
    }
};

// 🟢 Kategoriye Göre Ürün Getirme
export const getProductsByCategory = async (category) => {
    try {
        const response = await api.get(`/stoklar/category/${category}`);
        return response.data;
    } catch (error) {
        console.error("Ürünleri getirme hatası:", error);
        return [];
    }
};

// 🟢 Ürüne Göre Beden/Özellik Getirme
export const getSizesByProduct = async (category, productId) => {
    try {
        const response = await api.get(`/stoklar/size/${category}/${productId}`);
        return response.data;
    } catch (error) {
        console.error("Bedenleri getirme hatası:", error);
        return [];
    }
};

// 🔐 LOGIN (Giriş Yapma)
export const login = async (credentials) => {
    try {
        const response = await api.post("/admin/login", credentials);
        return response.data;
    } catch (error) {
        console.error("Giriş hatası:", error);
        throw error;
    }
};

// ✅ AUTH CHECK
export const checkAuth = async () => {
    try {
        const response = await api.get("/admin/auth");
        return response.data;
    } catch (error) {
        console.error("Yetkilendirme hatası:", error);
        throw error;
    }
};

// 🚪 LOGOUT
export const logout = async () => {
    try {
        const response = await api.post("/admin/logout");
        return response.data;
    } catch (error) {
        console.error("Çıkış hatası:", error);
        throw error;
    }
};

// 🟢 Ürün ve Demirbaşları Getir
export const getAllProductsAndAssets = async () => {
    try {
        const response = await api.get("/urun-demirbas/urunler-ve-demirbaslar");
        return response.data;
    } catch (error) {
        console.error("Veri çekme hatası:", error);
        return [];
    }
};

// 🟢 Yeni Ürün/Demirbaş Ekleme 
export const insertNewProductOrAsset = async (urunVerisi) => {
    try {
        const response = await api.post("/urun-demirbas-kayit/ekle", urunVerisi);
        return response.data;
    } catch (error) {
        console.error("Ürün ekleme hatası:", error);
        throw error;
    }
};

// 🟢 Kullanıcıları Getirme
export const getKullanicilar = async () => {
    try {
        const response = await api.get("/kullanici/kullanici-getir");
        return response.data;
    } catch (error) {
        console.error("Kullanıcıları çekerken hata oluştu:", error);
        return [];
    }
};

// 🟡 Kullanıcı Güncelleme
export const updateKullanici = async (id, data) => {
    try {
        await api.post(`/kullanici/kullanici-guncelle/${id}`, data);
        return true;
    } catch (error) {
        console.error("Kullanıcı güncellenirken hata oluştu:", error);
        return false;
    }
};

// 🔴 Yeni Kullanıcı Ekleme
export const addKullanici = async (data) => {
    try {
        await api.post("/kullanici/kullanici-ekle", data);
        return true;
    } catch (error) {
        console.error("Kullanıcı eklerken hata oluştu:", error);
        return false;
    }
};

// Kullanıcı silme
export const deleteKullanici = async (id) => {
    try {
        const response = await api.delete(`/kullanicilar/${id}`);
        return response.data;
    } catch (error) {
        console.error("Kullanıcı silme hatası:", error);
        throw error;
    }
};
