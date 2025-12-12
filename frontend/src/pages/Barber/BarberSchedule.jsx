// BarberSchedule.jsx - Обновленная версия с квадратными карточками

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getBarberById, getSchedulesByBarber, createSchedule, deleteSchedule } from "../../services/api";
import ScheduleCard from "../../components/Schedule/ScheduleCard";
import ScheduleForm from "../../components/Schedule/ScheduleForm";
import "../Barber/BarberSchedule.css";
import "../../components/Schedule/ScheduleCard.css";

const DAYS_OF_WEEK = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

export default function BarberSchedule() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [barber, setBarber] = useState(null);
    const [schedules, setSchedules] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [filterStatus, setFilterStatus] = useState('ALL');

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [barberData, schedulesData] = await Promise.all([
                getBarberById(id),
                getSchedulesByBarber(id)
            ]);
            setBarber(barberData);

            // Форматируем данные для карточек
            const formattedSchedules = DAYS_OF_WEEK.map(day => {
                const schedule = schedulesData.find(s => s.dayOfWeek === day);
                return {
                    day,
                    schedule: schedule ? {
                        ...schedule,
                        barberName: barberData ? `${barberData.firstName} ${barberData.lastName}` : ''
                    } : null
                };
            });

            setSchedules(formattedSchedules);
        } catch (e) {
            setError(e.message || "Ошибка загрузки данных");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSchedule = async (payload) => {
        try {
            await createSchedule(payload);
            alert("Расписание добавлено!");
            setShowForm(false);
            setSelectedDay(null);
            loadData();
        } catch (e) {
            alert("Ошибка при создании расписания: " + (e.message || e.status));
        }
    };

    const handleDeleteSchedule = async (scheduleId, dayName) => {
        if (!confirm(`Удалить расписание на ${dayName}?`)) return;
        try {
            await deleteSchedule(scheduleId);
            alert("Расписание удалено!");
            loadData();
        } catch (e) {
            alert("Ошибка при удалении: " + (e.message || e.status));
        }
    };

    const handleAddSchedule = (day) => {
        setSelectedDay(day);
        setShowForm(true);
    };

    const getStats = () => {
        const activeSchedules = schedules.filter(s => s.schedule?.active).length;
        const totalHours = schedules.reduce((total, { schedule }) => {
            if (schedule?.active) {
                const start = new Date(`2000-01-01T${schedule.startTime}`);
                const end = new Date(`2000-01-01T${schedule.endTime}`);
                return total + ((end - start) / (1000 * 60 * 60));
            }
            return total;
        }, 0);

        return {
            totalDays: schedules.filter(s => s.schedule).length,
            activeDays: activeSchedules,
            totalHours: totalHours.toFixed(1)
        };
    };

    const stats = getStats();

    const filteredSchedules = schedules.filter(({ schedule }) => {
        if (filterStatus === 'ALL') return true;
        if (filterStatus === 'ACTIVE') return schedule?.active;
        if (filterStatus === 'INACTIVE') return schedule && !schedule.active;
        if (filterStatus === 'EMPTY') return !schedule;
        return true;
    });

    if (loading) return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Загрузка расписания...</p>
        </div>
    );

    if (error) return (
        <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h3>Ошибка при загрузке</h3>
            <p>{error}</p>
            <button onClick={() => navigate("/barbers")} className="back-btn">
                Вернуться к списку
            </button>
        </div>
    );

    if (!barber) return (
        <div className="error-container">
            <div className="error-icon">👤</div>
            <h3>Барбер не найден</h3>
            <p>Запрошенный барбер не существует или был удален</p>
            <button onClick={() => navigate("/barbers")} className="back-btn">
                Вернуться к списку
            </button>
        </div>
    );

    return (
        <div className="barber-schedule-page">
            {/* Шапка страницы */}
            <div className="page-header">
                <div className="header-content">
                    <Link to="/barbers" className="back-link">
                        ← Назад к списку барберов
                    </Link>

                    <h1>Расписание работы</h1>
                    <p className="description">Управление графиком работы барбера</p>

                    <div className="barber-header">
                        <div className="barber-avatar">
                            {barber.firstName.charAt(0)}{barber.lastName.charAt(0)}
                        </div>
                        <div className="barber-details">
                            <h2>{barber.firstName} {barber.lastName}</h2>
                            <div className="barber-info-row">
                                <div className="barber-info-item">
                                    <span className="info-label">Телефон</span>
                                    <span className="info-value">📱 {barber.phone}</span>
                                </div>
                                <div className="barber-info-item">
                                    <span className="info-label">Статус</span>
                                    <span className={`barber-status ${barber.status.toLowerCase()}`}>
                                        {barber.status === "ACTIVE" ? "Активный" :
                                            barber.status === "INACTIVE" ? "Неактивный" :
                                                "В отпуске"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Статистика */}
            <div className="schedule-stats">
                <div className="stat-card">
                    <div className="stat-icon days">📅</div>
                    <div className="stat-content">
                        <span className="stat-number">{stats.totalDays}</span>
                        <span className="stat-label">Рабочих дней</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon active">✅</div>
                    <div className="stat-content">
                        <span className="stat-number">{stats.activeDays}</span>
                        <span className="stat-label">Активных дней</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon hours">⏱️</div>
                    <div className="stat-content">
                        <span className="stat-number">{stats.totalHours}</span>
                        <span className="stat-label">Часов в неделю</span>
                    </div>
                </div>
            </div>

            {/* Панель управления */}
            <div className="schedule-controls">
                <div className="search-filter">
                    <select
                        className="filter-select"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="ALL">Все дни</option>
                        <option value="ACTIVE">Только активные</option>
                        <option value="INACTIVE">Только неактивные</option>
                        <option value="EMPTY">Только выходные</option>
                    </select>
                </div>

                <div className="control-buttons">
                    <button
                        className="export-btn"
                        onClick={() => alert("Экспорт в разработке")}
                    >
                        📊 Экспорт
                    </button>

                    <button
                        className="add-schedule-btn"
                        onClick={() => {
                            setSelectedDay(null);
                            setShowForm(true);
                        }}
                    >
                        <span>+</span>
                        Добавить расписание
                    </button>
                </div>
            </div>

            {/* Сетка расписания */}
            <div className="schedule-grid">
                {filteredSchedules.map(({ day, schedule }) => (
                    <ScheduleCard
                        key={day}
                        day={day}
                        schedule={schedule}
                        barberId={barber.id}
                        onDelete={handleDeleteSchedule}
                        onAdd={handleAddSchedule}
                    />
                ))}
            </div>

            {/* Форма добавления/редактирования */}
            {showForm && (
                <div className="form-modal">
                    <div className="form-content">
                        <ScheduleForm
                            onSubmit={handleCreateSchedule}
                            submitLabel={selectedDay ? "Добавить расписание" : "Создать расписание"}
                            barbers={[barber]}
                            barberId={barber.id}
                            initial={selectedDay ? { dayOfWeek: selectedDay } : {}}
                        />
                        <div style={{ padding: '20px', textAlign: 'center' }}>
                            <button
                                onClick={() => {
                                    setShowForm(false);
                                    setSelectedDay(null);
                                }}
                                style={{
                                    padding: '10px 24px',
                                    background: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}