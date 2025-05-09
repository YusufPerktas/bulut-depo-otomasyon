import { useEffect, useState } from "react";
import { checkAuth } from "../services/api";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const [isAuth, setIsAuth] = useState(null);

    useEffect(() => {
        checkAuth()
            .then(() => setIsAuth(true))
            .catch(() => setIsAuth(false));
    }, []);

    if (isAuth === null) return <p>Yükleniyor...</p>;
    return isAuth ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
