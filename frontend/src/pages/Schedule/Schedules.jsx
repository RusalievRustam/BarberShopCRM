import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSchedules, deleteSchedule, getBarbers } from "../../services/api";
import "./Schedules.css";

const DAYS_RU = {
    MONDAY: "Понедельник",
    TUESDAY: "Вторник",
    WEDNESDAY: "Среда",
    THURSDAY: "Четверг",
    FRIDAY: "Пятница",
    SATURDAY: "Суббота",
    SUNDAY: "Воскресенье"
};

export default function Schedules() {
    const [schedules, setSchedules] = useState([]);
    const [barbers, setBarbers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterBarber, setFilterBarber] = useState("ALL");
    const [filterDay, setFilterDay] = useState("ALL");

    const loadSchedules = async () => {
        setLoading(true);
        setError(null);
        try {
            const [schedulesData, barbersData] = await Promise.all([
                getSchedules(),
                getBarbers()
            ]);
            setSchedules(schedulesData);
            setBarbers(barbersData || []);
        } catch (e) {
            setError(e.message || "Ошибка загрузки расписания");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSchedules();
    }, []);

    const handleDelete = async (id, barberName, day) => {
        if (!confirm(`Удалить расписание для ${barberName} (${DAYS_RU[day] || day})?`)) return;
        try {
            await deleteSchedule(id);
            setSchedules(schedules.filter(s => s.id !== id));
        } catch (e) {
            alert("Ошибка при удалении: " + (e.message || e.status));
        }
    };

    const handleSetActive = async (id) => {
        try {
            await setScheduleActive(id);
            loadSchedules(); // Перезагружаем список
        } catch (e) {
            alert("Ошибка при активации: " + (e.message || e.status));
        }
    };

    const formatTime = (time) => {
        if (!time) return "";
        return time.substring(0, 5); // Форматируем HH:mm
    };

    const getDayBadge = (day) => {
        const dayColors = {
            'MONDAY': { bg: 'rgba(59, 130, 246, 0.1)', color: '#2563eb' },
            'TUESDAY': { bg: 'rgba(16, 185, 129, 0.1)', color: '#047857' },
            'WEDNESDAY': { bg: 'rgba(245, 158, 11, 0.1)', color: '#b45309' },
            'THURSDAY': { bg: 'rgba(139, 92, 246, 0.1)', color: '#6d28d9' },
            'FRIDAY': { bg: 'rgba(236, 72, 153, 0.1)', color: '#db2777' },
            'SATURDAY': { bg: 'rgba(239, 68, 68, 0.1)', color: '#dc2626' },
            'SUNDAY': { bg: 'rgba(14, 165, 233, 0.1)', color: '#0369a1' }
        };

        const config = dayColors[day] || { bg: 'rgba(100, 116, 139, 0.1)', color: '#475569' };

        return (
            <span
                className="day-badge"
                style={{
                    background: config.bg,
                    color: config.color,
                    border: `1px solid ${config.border || 'transparent'}`
                }}
            >
                {DAYS_RU[day] || day}
            </span>
        );
    };

    const getStatusBadge = (active) => {
        if (active) {
            return <span className="status-badge status-active">Активно</span>;
        } else {
            return <span className="status-badge status-inactive">Неактивно</span>;
        }
    };

    const getBarberName = (barberId) => {
        const barber = barbers.find(b => b.id === barberId);
        return barber ? `${barber.firstName} ${barber.lastName}` : `Барбер #${barberId}`;
    };

    const filteredSchedules = schedules.filter(schedule => {
        if (filterBarber !== "ALL" && schedule.barberId !== parseInt(filterBarber)) return false;
        if (filterDay !== "ALL" && schedule.dayOfWeek !== filterDay) return false;
        return true;
    });

    const stats = {
        total: schedules.length,
        active: schedules.filter(s => s.active).length,
        workingDays: new Set(schedules.map(s => s.dayOfWeek)).size
    };

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
            <button onClick={loadSchedules} className="retry-btn">Попробовать снова</button>
        </div>
    );

    return (
        <div className="schedules-container">
            <div className="page-header">
                <h1>Рабочее расписание</h1>
                <p>Управление графиком работы барберов</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">📅</div>
                    <div className="stat-content">
                        <span className="stat-number">{stats.total}</span>
                        <span className="stat-label">Всего записей</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                        <span className="stat-number">{stats.active}</span>
                        <span className="stat-label">Активных</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🗓️</div>
                    <div className="stat-content">
                        <span className="stat-number">{stats.workingDays}</span>
                        <span className="stat-label">Рабочих дней</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">👨‍✂️</div>
                    <div className="stat-content">
                        <span className="stat-number">{barbers.filter(b => b.status === "ACTIVE").length}</span>
                        <span className="stat-label">Активных барберов</span>
                    </div>
                </div>
            </div>

            <div className="controls-bar">
                <div className="filters">
                    <div className="filter-group">
                        <label>Фильтр по барберу</label>
                        <select
                            value={filterBarber}
                            onChange={(e) => setFilterBarber(e.target.value)}
                            className="filter-select"
                        >
                            <option value="ALL">Все барберы</option>
                            {barbers
                                .filter(barber => barber.status === "ACTIVE")
                                .map(barber => (
                                    <option key={barber.id} value={barber.id}>
                                        {barber.firstName} {barber.lastName}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Фильтр по дню</label>
                        <select
                            value={filterDay}
                            onChange={(e) => setFilterDay(e.target.value)}
                            className="filter-select"
                        >
                            <option value="ALL">Все дни</option>
                            {Object.entries(DAYS_RU).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="actions">
                    <Link to="/schedules/create" className="add-btn">
                        <span className="btn-icon">+</span>
                        Добавить расписание
                    </Link>
                </div>
            </div>

            {filteredSchedules.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📅</div>
                    <h3>Расписание не найдено</h3>
                    <p>{filterBarber !== "ALL" || filterDay !== "ALL" ? "Попробуйте изменить фильтры" : "Добавьте первое расписание работы"}</p>
                    {filterBarber === "ALL" && filterDay === "ALL" && (
                        <Link to="/schedules/create" className="empty-btn">
                            Добавить расписание
                        </Link>
                    )}
                </div>
            ) : (
                <div className="table-container">
                    <table className="schedules-table">
                        <thead>
                        <tr>
                            <th>Барбер</th>
                            <th>День недели</th>
                            <th>Время работы</th>
                            <th>Продолжительность</th>
                            <th>Статус</th>
                            <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredSchedules.map(schedule => (
                            <tr key={schedule.id}>
                                <td>
                                    <div className="barber-info">
                                        <div className="barber-name">
                                            {getBarberName(schedule.barberName, schedule.lastName)}
                                        </div>
                                        <div className="barber-id">
                                            ID: {schedule.barberId}
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    {getDayBadge(schedule.dayOfWeek)}
                                </td>
                                <td>
                                    <div className="time-slot">
                                        <span className="start-time">{formatTime(schedule.startTime)}</span>
                                        <span className="time-separator"> - </span>
                                        <span className="end-time">{formatTime(schedule.endTime)}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="duration-cell">
                                        {(() => {
                                            const start = new Date(`2000-01-01T${schedule.startTime}`);
                                            const end = new Date(`2000-01-01T${schedule.endTime}`);
                                            const diffHours = (end - start) / (1000 * 60 * 60);
                                            return `${diffHours.toFixed(1)} ч`;
                                        })()}
                                    </div>
                                </td>
                                <td>
                                    {getStatusBadge(schedule.active)}
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <Link
                                            to={`/schedules/${schedule.id}/edit`}
                                            className="edit-btn"
                                        >
                                            Ред.
                                        </Link>
                                        {!schedule.active && (
                                            <button
                                                onClick={() => handleSetActive(schedule.id)}
                                                className="activate-btn"
                                                title="Сделать активным"
                                            >
                                                ✅
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(
                                                schedule.id,
                                                getBarberName(schedule.barberId),
                                                schedule.dayOfWeek
                                            )}
                                            className="delete-btn"
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div className="table-footer">
                        <span className="schedules-count">
                            Показано записей: {filteredSchedules.length} из {schedules.length}
                        </span>
                        <div className="schedule-summary">
                            <span className="summary-item">
                                Средний рабочий день: {(() => {
                                const durations = schedules.map(s => {
                                    const start = new Date(`2000-01-01T${s.startTime}`);
                                    const end = new Date(`2000-01-01T${s.endTime}`);
                                    return (end - start) / (1000 * 60 * 60);
                                });
                                const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
                                return avg ? `${avg.toFixed(1)} часов` : "—";
                            })()}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}