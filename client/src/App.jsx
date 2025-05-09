import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Anasayfa from "./pages/Anasayfa"; //diğer sayfalarda eklenecek
import UrunDemirbas from "./pages/UrunDemirbas";
import UrunDemirbasKayit from "./pages/UrunDemirbasKayit";
import KullaniciIslemleri from "./pages/KullaniciIslemleri";
import EsyaZimmetleme from "./pages/EsyaZimmetleme";
import StokIslemleri from "./pages/StokIslemleri";
import Raporlar from "./pages/Raporlar";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* Protected Route ile korunan sayfalar */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Routes>
                <Route path="/Anasayfa" element={<Anasayfa />} />
                <Route path="/UrunDemirbas" element={<UrunDemirbas />} />
                <Route path="/UrunDemirbasKayit" element={<UrunDemirbasKayit />} />
                <Route path="/KullaniciIslemleri" element={<KullaniciIslemleri />} />
                <Route path="/EsyaZimmetleme" element={<EsyaZimmetleme />} />
                <Route path="/StokIslemleri" element={<StokIslemleri />} />
                <Route path="/Raporlar" element={<Raporlar />} />
                {/* Diğer sayfalar buraya eklenecek */}
              </Routes>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
