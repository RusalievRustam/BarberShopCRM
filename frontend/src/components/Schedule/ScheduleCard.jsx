// ScheduleCard.jsx - Компонент карточки дня недели

import React from 'react';
import { Link } from 'react-router-dom';
import './ScheduleCard.css';

const DAY_COLORS = {
    MONDAY: {
        gradient: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
        border: '#0284c7',
        number: '#0369a1'
    },
    TUESDAY: {
        gradient: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
        border: '#16a34a',
        number: '#15803d'
    },
    WEDNESDAY: {
        gradient: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        border: '#d97706',
        number: '#b45309'
    },
    THURSDAY: {
        gradient: 'linear-gradient(135deg, #fae8ff 0%, #f5d0fe 100%)',
        border: '#c026d3',
        number: '#a21caf'
    },
    FRIDAY: {
        gradient: 'linear-gradient(135deg, #ffe4e6 0%, #fecdd3 100%)',
        border: '#e11d48',
        number: '#be123c'
    },
    SATURDAY: {
        gradient: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)',
        border: '#ea580c',
        number: '#c2410c'
    },
    SUNDAY: {
        gradient: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
        border: '#2563eb',
        number: '#1d4ed8'
    }
};

const DAY_NUMBERS = {
    MONDAY: '01',
    TUESDAY: '02',
    WEDNESDAY: '03',
    THURSDAY: '04',
    FRIDAY: '05',
    SATURDAY: '06',
    SUNDAY: '07'
};

const ScheduleCard = ({
                          day,
                          schedule,
                          barberId,
                          onDelete,
                          onAdd
                      }) => {
    const dayName = {
        MONDAY: 'Понедельник',
        TUESDAY: 'Вторник',
        WEDNESDAY: 'Среда',
        THURSDAY: 'Четверг',
        FRIDAY: 'Пятница',
        SATURDAY: 'Суббота',
        SUNDAY: 'Воскресенье'
    }[day];

    const dayColor = DAY_COLORS[day] || DAY_COLORS.MONDAY;
    const dayNumber = DAY_NUMBERS[day] || '00';

    const formatTime = (time) => {
        if (!time) return '';
        return time.substring(0, 5);
    };

    const calculateDuration = (start, end) => {
        if (!start || !end) return '0 ч';
        const startDate = new Date(`2000-01-01T${start}`);
        const endDate = new Date(`2000-01-01T${end}`);
        const diffHours = (endDate - startDate) / (1000 * 60 * 60);
        return `${diffHours.toFixed(1)} ч`;
    };

    if (!schedule) {
        return (
            <div className="day-card empty">
                <div className="day-header">
                    <h3 className="day-title">{dayName}</h3>
                </div>
                <span className="day-number">{dayNumber}</span>
                <div className="day-content empty">
                    <div className="empty-icon">📅</div>
                    <p className="empty-text">Выходной</p>
                    <button
                        className="add-day-btn"
                        onClick={() => onAdd(day)}
                    >
                        <span className="btn-icon">+</span>
                        Добавить график
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`day-card ${day.toLowerCase()}`}
            style={{
                background: dayColor.gradient,
                borderLeftColor: dayColor.border
            }}
        >
            <div className="day-header">
                <h3 className="day-title">{dayName}</h3>
                <div className="status-container">
                    <div className={`status-dot ${schedule.active ? 'active' : 'inactive'}`} />
                    <span className="status-text">
                        {schedule.active ? 'Активно' : 'Неактивно'}
                    </span>
                </div>
            </div>

            <span className="day-number" style={{ color: dayColor.number }}>
                {dayNumber}
            </span>

            <div className="day-content">
                <div className="time-info">
                    <span className="time-label">Рабочее время</span>
                    <span className="time-value">
                        {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                    </span>
                </div>

                <div className="work-hours">
                    <span className="hours-icon">⏱️</span>
                    <span className="hours-text">
                        {calculateDuration(schedule.startTime, schedule.endTime)}
                    </span>
                </div>

                {schedule.barberName && (
                    <div className="barber-info">
                        <span className="barber-name">Барбер</span>
                        <span className="barber-value">{schedule.barberName}</span>
                    </div>
                )}
            </div>

            <div className="day-actions">
                <Link
                    to={`/schedules/${schedule.id}/edit`}
                    className="edit-btn"
                >
                    <span className="btn-icon">✏️</span>
                    Редактировать
                </Link>

                <button
                    className="delete-btn"
                    onClick={() => onDelete(schedule.id, dayName)}
                >
                    <span className="btn-icon">🗑️</span>
                    Удалить
                </button>
            </div>
        </div>
    );
};

export default ScheduleCard;