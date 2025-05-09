import axios from "axios";

const api = axios.create({
    baseURL: "http://13.49.224.225:5000/api",
    withCredentials: true
});

export const checkAuth = async () => {
    try {
        const response = await api.get("/admin/auth");
        return response.data;
    } catch (error) {
        console.error("Yetkilendirme hatası:", error.response?.data || error.message);
        throw error;
    }
};
