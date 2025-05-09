import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await login({ username, password });
            console.log("Login API Response:", response);

            // 🟢 Başarılı giriş toast bildirimi
            await MySwal.fire({
                title: <span>{response.message || "Giriş başarılı"}</span>,
                icon: 'success',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1500,
                showCloseButton: true,
                customClass: { popup: 'color-success' },
            });

            navigate("/Anasayfa");
        } catch (err) {
            console.error("Login hatası:", err.response?.data || err.message);

            // 🔴 Hatalı giriş toast bildirimi
            MySwal.fire({
                title: <span>{err.response?.data?.message || "Hatalı giriş yaptınız!"}</span>,
                icon: 'error',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                showCloseButton: true,
                customClass: { popup: 'color-error' },
            });
        }
    };

    return (
        <div className="container-xxl">
            <div className="authentication-wrapper authentication-basic container-p-y">
                <div className="authentication-inner">
                    <div className="card">
                        <div className="card-body">
                            <div className="app-brand justify-content-center gap-2">
                                <span className="app-brand-logo demo">
                                    <img src="/assets/img/icons/brands/asana.png" alt="Logo" width="25" />
                                </span>
                                <span className="app-brand-text demo text-body fw-bolder">Depo</span>
                            </div>

                            <p className="mb-4">Lütfen depoya erişmek için giriş yapın.</p>

                            <form id="formAuthentication" className="mb-3" onSubmit={handleLogin}>
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">Kullanıcı Adı</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="username"
                                        placeholder="Kullanıcı adınızı girin"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3 form-password-toggle">
                                    <label className="form-label" htmlFor="password">Parola</label>
                                    <div className="input-group input-group-merge">
                                        <input
                                            type="password"
                                            id="password"
                                            className="form-control"
                                            placeholder="Şifrenizi girin"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <button className="btn btn-primary d-grid w-100">Giriş Yap</button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
