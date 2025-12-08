import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserForm from "../../components/User/UserForm";
import { createUser, getRoles } from "../../services/api";
import "../PageLayout.css";

export default function CreateUser() {
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadRoles();
    }, []);

    const loadRoles = async () => {
        try {
            const data = await getRoles();
            setRoles(data || []);
        } catch (e) {
            console.error("Ошибка загрузки ролей:", e);
            setError("Не удалось загрузить список ролей");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (payload) => {
        try {
            await createUser(payload);
            alert("Пользователь успешно создан!");
            navigate("/admin/users");
        } catch (e) {
            alert("Ошибка при создании: " + (e.message || e.status));
        }
    };

    if (loading) return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Загрузка данных...</p>
        </div>
    );

    return (
        <div className="page-layout">
            <div className="page-header">
                <h1>Создать пользователя</h1>
                <p>Добавьте нового пользователя в систему</p>
            </div>

            {error && (
                <div className="error-message" style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: '#dc2626',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1.5rem',
                    border: '1px solid rgba(239, 68, 68, 0.2)'
                }}>
                    <strong>Ошибка:</strong> {error}
                </div>
            )}

            <UserForm
                onSubmit={handleCreate}
                submitLabel="Создать пользователя"
                roles={roles}
            />
        </div>
    );
}