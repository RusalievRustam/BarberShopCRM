import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ClientForm from "../../components/Client/ClientForm.jsx";
import { getClientById, updateClient } from "../../services/api";
import "../PageLayout.css";

export default function EditClient() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [initial, setInitial] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const data = await getClientById(id);
                setInitial(data);
            } catch (e) {
                alert("Не удалось загрузить данные клиента: " + (e.message || e.status));
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    const handleUpdate = async (payload) => {
        try {
            await updateClient(id, payload);
            alert("Изменения сохранены!");
            navigate("/clients");
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

    if (!initial) return (
        <div className="error-container">
            <div className="error-icon">❌</div>
            <h3>Клиент не найден</h3>
            <p>Запрошенный клиент не существует или был удален</p>
            <button onClick={() => navigate("/clients")} className="retry-btn">
                Вернуться к списку
            </button>
        </div>
    );

    return (
        <div className="page-layout">
            <div className="page-header">
                <h1>Редактировать клиента</h1>
                <p>Внесите изменения в информацию о клиенте</p>
            </div>
            <ClientForm initial={initial} onSubmit={handleUpdate} submitLabel="Сохранить изменения" />
        </div>
    );
}