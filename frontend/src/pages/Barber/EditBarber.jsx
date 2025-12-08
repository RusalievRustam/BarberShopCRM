import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BarberForm from "../../components/Barber/BarberForm.jsx";
import { getBarberById, updateBarber } from "../../services/api.js";
import "../PageLayout.css";

export default function EditBarber() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [initial, setInitial] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const data = await getBarberById(id);
                setInitial(data);
            } catch (e) {
                alert("Не удалось загрузить данные барбера: " + (e.message || e.status));
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    const handleUpdate = async (payload) => {
        try {
            await updateBarber(id, payload);
            alert("Изменения сохранены!");
            navigate("/barbers");
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
            <h3>Барбер не найден</h3>
            <p>Запрошенный барбер не существует или был удален</p>
            <button onClick={() => navigate("/barbers")} className="retry-btn">
                Вернуться к списку
            </button>
        </div>
    );

    return (
        <div className="page-layout">
            <div className="page-header">
                <h1>Редактировать барбера</h1>
                <p>Внесите изменения в информацию о барбере</p>
            </div>
            <BarberForm initial={initial} onSubmit={handleUpdate} submitLabel="Сохранить изменения" />
        </div>
    );
}