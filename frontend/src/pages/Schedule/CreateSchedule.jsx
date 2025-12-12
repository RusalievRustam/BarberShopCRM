import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ScheduleForm from "../../components/Schedule/ScheduleForm.jsx";
import { createSchedule, getBarbers } from "../../services/api.js"
import "../PageLayout.css";

export default function CreateSchedule() {
    const navigate = useNavigate();
    const [barbers, setBarbers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadBarbers();
    }, []);

    const loadBarbers = async () => {
        try {
            const data = await getBarbers();
            setBarbers(data || []);
        } catch (e) {
            console.error("Ошибка загрузки барберов:", e);
            setError("Не удалось загрузить список барберов");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (payload) => {
        try {
            await createSchedule(payload);
            alert("Расписание успешно создано!");
            navigate("/schedules");
        } catch (e) {
            alert("Ошибка при создании расписания: " + (e.message || e.status));
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
                <h1>Создать расписание</h1>
                <p>Добавьте новый рабочий график для барбера</p>
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

            <ScheduleForm
                onSubmit={handleCreate}
                submitLabel="Создать расписание"
                barbers={barbers}
            />
        </div>
    );
}