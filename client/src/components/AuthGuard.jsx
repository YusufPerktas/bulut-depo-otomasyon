import React from "react";
import { Navigate } from "react-router-dom";

const AuthGuard = ({ children }) => {
    const userInfo = localStorage.getItem("userInfo");

    // Giriş yapılmamışsa login sayfasına yönlendir
    if (!userInfo) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default AuthGuard;
