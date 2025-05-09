import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AuthGuard from "./components/AuthGuard";
import Anasayfa from "./pages/Anasayfa";
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
        {/* Anasayfaya direkt link verildiğinde login sayfasına yönlendir */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        
        {/* Giriş yapılmadan erişilemeyecek sayfalar */}
        <Route
          path="/Anasayfa"
          element={
            <AuthGuard>
              <Anasayfa />
            </AuthGuard>
          }
        />
        <Route
          path="/UrunDemirbas"
          element={
            <AuthGuard>
              <UrunDemirbas />
            </AuthGuard>
          }
        />
        <Route
          path="/UrunDemirbasKayit"
          element={
            <AuthGuard>
              <UrunDemirbasKayit />
            </AuthGuard>
          }
        />
        <Route
          path="/KullaniciIslemleri"
          element={
            <AuthGuard>
              <KullaniciIslemleri />
            </AuthGuard>
          }
        />
        <Route
          path="/EsyaZimmetleme"
          element={
            <AuthGuard>
              <EsyaZimmetleme />
            </AuthGuard>
          }
        />
        <Route
          path="/StokIslemleri"
          element={
            <AuthGuard>
              <StokIslemleri />
            </AuthGuard>
          }
        />
        <Route
          path="/Raporlar"
          element={
            <AuthGuard>
              <Raporlar />
            </AuthGuard>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
