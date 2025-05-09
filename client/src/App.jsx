import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
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
        <Route path="/login" element={<Login />} />

        {/* Korumalı rotaları doğrudan ProtectedRoute içinde tanımla */}
        <Route
          path="/Anasayfa"
          element={
            <ProtectedRoute>
              <Anasayfa />
            </ProtectedRoute>
          }
        />
        <Route
          path="/UrunDemirbas"
          element={
            <ProtectedRoute>
              <UrunDemirbas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/UrunDemirbasKayit"
          element={
            <ProtectedRoute>
              <UrunDemirbasKayit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/KullaniciIslemleri"
          element={
            <ProtectedRoute>
              <KullaniciIslemleri />
            </ProtectedRoute>
          }
        />
        <Route
          path="/EsyaZimmetleme"
          element={
            <ProtectedRoute>
              <EsyaZimmetleme />
            </ProtectedRoute>
          }
        />
        <Route
          path="/StokIslemleri"
          element={
            <ProtectedRoute>
              <StokIslemleri />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Raporlar"
          element={
            <ProtectedRoute>
              <Raporlar />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
