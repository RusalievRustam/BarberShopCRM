import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ScheduleForm from "../../components/Schedule/ScheduleForm";
import { getScheduleById, updateSchedule, getBarbers } from "../../services/api.js";
import "../PageLayout.css";

export default function EditSchedule() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [initial, setInitial] = useState(null);
    const [barbers, setBarbers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const [scheduleData, barbersData] = await Promise.all([
                getScheduleById(id),
                getBarbers()
            ]);

            setInitial(scheduleData);
            setBarbers(barbersData || []);
        } catch (e) {
            setError("Не удалось загрузить данные расписания: " + (e.message || e.status));
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (payload) => {
        try {
            await updateSchedule(id, payload);
            alert("Изменения сохранены!");
            navigate("/schedules");
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
            <button onClick={() => navigate("/schedules")} className="retry-btn">
                Вернуться к списку
            </button>
        </div>
    );

    if (!initial) return (
        <div className="error-container">
            <div className="error-icon">📅</div>
            <h3>Расписание не найдено</h3>
            <p>Запрошенное расписание не существует или было удалено</p>
            <button onClick={() => navigate("/schedules")} className="retry-btn">
                Вернуться к списку
            </button>
        </div>
    );

    return (
        <div className="page-layout">
            <div className="page-header">
                <h1>Редактировать расписание</h1>
                <p>Внесите изменения в рабочий график</p>
            </div>
            <ScheduleForm
                initial={initial}
                onSubmit={handleUpdate}
                submitLabel="Сохранить изменения"
                barbers={barbers}
                barberId={initial.barberId}
            />
        </div>
    );
}