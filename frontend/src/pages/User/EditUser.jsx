import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserForm from "../../components/User/UserForm";
import { getUserById, updateUser, getRoles } from "../../services/api";
import "../PageLayout.css";

export default function EditUser() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [initial, setInitial] = useState(null);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const [userData, rolesData] = await Promise.all([
                getUserById(id),
                getRoles()
            ]);
            setInitial(userData);
            setRoles(rolesData || []);
        } catch (e) {
            setError("Не удалось загрузить данные пользователя: " + (e.message || e.status));
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (payload) => {
        try {
            await updateUser(id, payload);
            alert("Изменения сохранены!");
            navigate("/admin/users");
        } catch (e) {
            alert("Ошибка при сохранении: " + (e.message || e.status));
        }
    };

    if (loading) return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Загрузка данных...</p>
        </div>
    );

    if (error) return (
        <div className="error-container">
            <div className="error-icon">❌</div>
            <h3>Ошибка загрузки</h3>
            <p>{error}</p>
            <button onClick={() => navigate("/admin/users")} className="retry-btn">
                Вернуться к списку
            </button>
        </div>
    );

    if (!initial) return (
        <div className="error-container">
            <div className="error-icon">👤</div>
            <h3>Пользователь не найден</h3>
            <p>Запрошенный пользователь не существует или был удален</p>
            <button onClick={() => navigate("/admin/users")} className="retry-btn">
                Вернуться к списку
            </button>
        </div>
    );

    return (
        <div className="page-layout">
            <div className="page-header">
                <h1>Редактировать пользователя</h1>
                <p>Внесите изменения в данные пользователя</p>
            </div>
            <UserForm
                initial={initial}
                onSubmit={handleUpdate}
                submitLabel="Сохранить изменения"
                roles={roles}
            />
        </div>
    );
}