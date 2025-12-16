import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { registerUser, getRoles } from "../../services/api";
import "./Auth.css";

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [roleId, setRoleId] = useState("");
    const [active, setActive] = useState(true);
    const [roles, setRoles] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const res = await getRoles();
                setRoles(res);
                if (res.length > 0) setRoleId(res[0].id); // дефолт
            } catch (err) {
                console.error("Не удалось загрузить роли", err);
            }
        };
        fetchRoles();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await registerUser({ username, password, roleId, active });
            alert("Пользователь зарегистрирован!");
            navigate("/login");
        } catch (err) {
            setError(err.message || "Ошибка регистрации");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-brand">
                    <div className="auth-logo">💈</div>
                    <div className="auth-appname">BarberShop Pro</div>
                </div>

                <h2>Регистрация</h2>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Имя пользователя</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Пароль</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Роль</label>
                        <select value={roleId} onChange={(e) => setRoleId(e.target.value)}>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="auth-checkbox">
                            <input
                                type="checkbox"
                                checked={active}
                                onChange={(e) => setActive(e.target.checked)}
                            />
                            Активен
                        </label>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button className="auth-btn" type="submit" disabled={loading}>
                        {loading ? "Регистрация..." : "Зарегистрироваться"}
                    </button>
                </form>

                <p className="auth-footer">
                    Уже есть аккаунт? <Link to="/login">Войти</Link>
                </p>
            </div>
        </div>
    );
}