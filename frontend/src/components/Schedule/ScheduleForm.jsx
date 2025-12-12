import React, { useState, useEffect } from "react";
import "./ScheduleForm.css";

const DAYS_OF_WEEK = [
    { value: "MONDAY", label: "Понедельник" },
    { value: "TUESDAY", label: "Вторник" },
    { value: "WEDNESDAY", label: "Среда" },
    { value: "THURSDAY", label: "Четверг" },
    { value: "FRIDAY", label: "Пятница" },
    { value: "SATURDAY", label: "Суббота" },
    { value: "SUNDAY", label: "Воскресенье" }
];

export default function ScheduleForm({
                                         initial = {},
                                         onSubmit,
                                         submitLabel = "Сохранить",
                                         barbers = [],
                                         barberId = null
                                     }) {
    // Упрощенное состояние без useEffect
    const [form, setForm] = useState(() => ({
        barberId: barberId || initial.barberId || "",
        dayOfWeek: initial.dayOfWeek || "",
        startTime: initial.startTime || "09:00",
        endTime: initial.endTime || "18:00",
        active: initial.active !== undefined ? initial.active : true
    }));

    const [errors, setErrors] = useState({});

    // ТОЛЬКО для обновления, когда меняется barberId из пропсов
    useEffect(() => {
        if (barberId && barberId !== form.barberId) {
            setForm(prev => ({
                ...prev,
                barberId: barberId
            }));
        }
    }, [barberId]); // Только при изменении barberId

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!form.barberId) {
            newErrors.barberId = "Выберите барбера";
        }

        if (!form.dayOfWeek) {
            newErrors.dayOfWeek = "Выберите день недели";
        }

        if (!form.startTime) {
            newErrors.startTime = "Укажите время начала";
        }

        if (!form.endTime) {
            newErrors.endTime = "Укажите время окончания";
        } else if (form.startTime && form.endTime) {
            const start = new Date(`2000-01-01T${form.startTime}`);
            const end = new Date(`2000-01-01T${form.endTime}`);
            if (end <= start) {
                newErrors.endTime = "Время окончания должно быть позже времени начала";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const payload = {
            ...form,
            barberId: parseInt(form.barberId)
        };

        await onSubmit(payload);
    };

    const getBarberName = (barberId) => {
        const barber = barbers.find(b => b.id === parseInt(barberId));
        return barber ? `${barber.firstName} ${barber.lastName}` : "";
    };

    const getDayLabel = (dayValue) => {
        const day = DAYS_OF_WEEK.find(d => d.value === dayValue);
        return day ? day.label : dayValue;
    };

    const calculateDuration = () => {
        if (!form.startTime || !form.endTime) return "0 часов";

        const start = new Date(`2000-01-01T${form.startTime}`);
        const end = new Date(`2000-01-01T${form.endTime}`);
        const diffHours = (end - start) / (1000 * 60 * 60);

        if (diffHours <= 0) return "0 часов";

        const hours = Math.floor(diffHours);
        const minutes = Math.round((diffHours - hours) * 60);

        let result = "";
        if (hours > 0) result += `${hours} час${hours === 1 ? '' : hours < 5 ? 'а' : 'ов'}`;
        if (minutes > 0) {
            if (result) result += " ";
            result += `${minutes} минут${minutes === 1 ? 'а' : minutes < 5 ? 'ы' : ''}`;
        }

        return result || "0 часов";
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit} className="schedule-form">
                <div className="form-section">
                    <h3 className="section-title">Рабочее расписание</h3>

                    {!barberId && (
                        <div className="form-group">
                            <label htmlFor="barberId">Барбер *</label>
                            <select
                                id="barberId"
                                name="barberId"
                                value={form.barberId}
                                onChange={handleChange}
                                className={errors.barberId ? "error" : ""}
                            >
                                <option value="">Выберите барбера</option>
                                {barbers
                                    .filter(barber => barber.status === "ACTIVE")
                                    .map(barber => (
                                        <option key={barber.id} value={barber.id}>
                                            {barber.firstName} {barber.lastName}
                                        </option>
                                    ))
                                }
                            </select>
                            {errors.barberId && <div className="error-message">{errors.barberId}</div>}
                        </div>
                    )}

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="dayOfWeek">День недели *</label>
                            <select
                                id="dayOfWeek"
                                name="dayOfWeek"
                                value={form.dayOfWeek}
                                onChange={handleChange}
                                className={errors.dayOfWeek ? "error" : ""}
                            >
                                <option value="">Выберите день</option>
                                {DAYS_OF_WEEK.map(day => (
                                    <option key={day.value} value={day.value}>
                                        {day.label}
                                    </option>
                                ))}
                            </select>
                            {errors.dayOfWeek && <div className="error-message">{errors.dayOfWeek}</div>}
                        </div>

                        <div className="form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="active"
                                    checked={form.active}
                                    onChange={handleChange}
                                    className="checkbox-input"
                                />
                                <span className="checkbox-custom"></span>
                                <span className="checkbox-text">Активное расписание</span>
                            </label>
                            <div className="checkbox-hint">
                                Неактивное расписание не учитывается при записи
                            </div>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="startTime">Время начала *</label>
                            <input
                                id="startTime"
                                name="startTime"
                                type="time"
                                value={form.startTime}
                                onChange={handleChange}
                                className={errors.startTime ? "error" : ""}
                                step="300" // 5 минут
                            />
                            {errors.startTime && <div className="error-message">{errors.startTime}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="endTime">Время окончания *</label>
                            <input
                                id="endTime"
                                name="endTime"
                                type="time"
                                value={form.endTime}
                                onChange={handleChange}
                                className={errors.endTime ? "error" : ""}
                                step="300"
                            />
                            {errors.endTime && <div className="error-message">{errors.endTime}</div>}
                        </div>
                    </div>
                </div>

                <div className="schedule-summary">
                    <h3 className="section-title">Сводка расписания</h3>
                    <div className="summary-content">
                        <div className="summary-item">
                            <span className="summary-label">Барбер:</span>
                            <span className="summary-value">
                                {form.barberId ? getBarberName(form.barberId) : "Не выбран"}
                            </span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">День недели:</span>
                            <span className="summary-value">
                                {form.dayOfWeek ? getDayLabel(form.dayOfWeek) : "Не выбран"}
                            </span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">Время работы:</span>
                            <span className="summary-value">
                                {form.startTime && form.endTime
                                    ? `${form.startTime} - ${form.endTime}`
                                    : "Не указано"}
                            </span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">Продолжительность:</span>
                            <span className="summary-value">{calculateDuration()}</span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">Статус:</span>
                            <span className={`status-indicator ${form.active ? "active" : "inactive"}`}>
                                {form.active ? "Активно" : "Неактивно"}
                            </span>
                        </div>
                    </div>
                </div>

                <button type="submit" className="submit-btn">
                    {submitLabel}
                </button>
            </form>
        </div>
    );
}