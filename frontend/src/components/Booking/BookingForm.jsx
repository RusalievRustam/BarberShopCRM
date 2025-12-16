import React, { useState, useEffect, useRef } from "react";
import "./BookingForm.css";

export default function BookingForm({
                                        initial = {},
                                        onSubmit,
                                        submitLabel = "Сохранить",
                                        clients = [],
                                        barbers = [],
                                        procedures = [],
                                        isEditing = false
                                    }) {
    const loaded = useRef(false);
    const [form, setForm] = useState({
        clientId: initial.clientId || "",
        barberId: initial.barberId || "",
        procedureId: initial.procedureId || "",
        startTime: initial.startTime ? String(initial.startTime).slice(0, 16) : "",
        status: initial.status || "ACTIVE"
    });

    const [errors, setErrors] = useState({});
    const [calculatedEndTime, setCalculatedEndTime] = useState("");

    useEffect(() => {
        if (!loaded.current) {
            setForm({
                clientId: initial.clientId || "",
                barberId: initial.barberId || "",
                procedureId: initial.procedureId || "",
                startTime: initial.startTime ? String(initial.startTime).slice(0, 16) : "",
                status: initial.status || "ACTIVE"
            });
            loaded.current = true;
        }
    }, [initial]);

    // Рассчитываем время окончания при выборе процедуры
    useEffect(() => {
        if (form.procedureId && form.startTime) {
            const selectedProcedure = procedures.find(p => p.id === parseInt(form.procedureId));
            if (selectedProcedure && selectedProcedure.duration) {
                const start = new Date(form.startTime);
                const end = new Date(start.getTime() + selectedProcedure.duration * 60000);
                setCalculatedEndTime(end.toLocaleString('ru-RU'));
            }
        }
    }, [form.procedureId, form.startTime, procedures]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!form.clientId) {
            newErrors.clientId = "Выберите клиента";
        }

        if (!form.barberId) {
            newErrors.barberId = "Выберите барбера";
        }

        if (!form.procedureId) {
            newErrors.procedureId = "Выберите услугу";
        }

        if (!form.startTime) {
            newErrors.startTime = "Укажите дату и время";
        } else {
            const selectedTime = new Date(form.startTime);
            const now = new Date();
            if (selectedTime < now) {
                newErrors.startTime = "Нельзя записаться на прошедшее время";
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
            clientId: parseInt(form.clientId),
            barberId: parseInt(form.barberId),
            procedureId: parseInt(form.procedureId)
        };

        await onSubmit(payload);
    };

    const getClientName = (clientId) => {
        const client = clients.find(c => c.id === parseInt(clientId));
        return client ? `${client.firstName} ${client.lastName}` : "";
    };

    const getBarberName = (barberId) => {
        const barber = barbers.find(b => b.id === parseInt(barberId));
        return barber ? `${barber.firstName} ${barber.lastName}` : "";
    };

    const getProcedureName = (procedureId) => {
        const procedure = procedures.find(p => p.id === parseInt(procedureId));
        return procedure ? procedure.procedureName : "";
    };

    const getProcedureDuration = (procedureId) => {
        const procedure = procedures.find(p => p.id === parseInt(procedureId));
        return procedure ? procedure.duration : 0;
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit} className="booking-form">
                <div className="form-section">
                    <h3 className="section-title">Информация о записи</h3>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="clientId">Клиент *</label>
                            <select
                                id="clientId"
                                name="clientId"
                                value={form.clientId}
                                onChange={handleChange}
                                className={errors.clientId ? "error" : ""}
                            >
                                <option value="">Выберите клиента</option>
                                {clients.map(client => (
                                    <option key={client.id} value={client.id}>
                                        {client.firstName} {client.lastName} ({client.phoneNumber})
                                    </option>
                                ))}
                            </select>
                            {errors.clientId && <div className="error-message">{errors.clientId}</div>}
                        </div>

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
                    </div>

                    <div className="form-group">
                        <label htmlFor="procedureId">Услуга *</label>
                        <select
                            id="procedureId"
                            name="procedureId"
                            value={form.procedureId}
                            onChange={handleChange}
                            className={errors.procedureId ? "error" : ""}
                        >
                            <option value="">Выберите услугу</option>
                            {procedures.map(procedure => (
                                <option key={procedure.id} value={procedure.id}>
                                    {procedure.procedureName} ({procedure.duration} мин.) - {procedure.price} Сом
                                </option>
                            ))}
                        </select>
                        {errors.procedureId && <div className="error-message">{errors.procedureId}</div>}

                        {form.procedureId && (
                            <div className="procedure-info">
                                <span>Продолжительность: {getProcedureDuration(form.procedureId)} минут</span>
                            </div>
                        )}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="startTime">Дата и время *</label>
                            <input
                                id="startTime"
                                name="startTime"
                                type="datetime-local"
                                value={form.startTime}
                                onChange={handleChange}
                                className={errors.startTime ? "error" : ""}
                                min={new Date().toISOString().slice(0, 16)}
                            />
                            {errors.startTime && <div className="error-message">{errors.startTime}</div>}
                        </div>

                        <div className="form-group">
                            <label>Время окончания</label>
                            <div className="calculated-time">
                                {calculatedEndTime || "—"}
                            </div>
                        </div>
                    </div>

                    {isEditing && (
                        <div className="form-group">
                            <label htmlFor="status">Статус</label>
                            <select
                                id="status"
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                            >
                                <option value="ACTIVE">Активно</option>
                                <option value="COMPLETED">Завершено</option>
                                <option value="CANCELLED">Отменено</option>
                                <option value="RESCHEDULED">Перенесено</option>
                            </select>
                        </div>
                    )}
                </div>

                <div className="booking-summary">
                    <h3 className="section-title">Сводка записи</h3>
                    <div className="summary-content">
                        <div className="summary-item">
                            <span className="summary-label">Клиент:</span>
                            <span className="summary-value">
                                {form.clientId ? getClientName(form.clientId) : "Не выбран"}
                            </span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">Барбер:</span>
                            <span className="summary-value">
                                {form.barberId ? getBarberName(form.barberId) : "Не выбран"}
                            </span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">Услуга:</span>
                            <span className="summary-value">
                                {form.procedureId ? getProcedureName(form.procedureId) : "Не выбрана"}
                            </span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">Начало:</span>
                            <span className="summary-value">
                                {form.startTime ? new Date(form.startTime).toLocaleString('ru-RU') : "Не указано"}
                            </span>
                        </div>
                        {calculatedEndTime && (
                            <div className="summary-item">
                                <span className="summary-label">Окончание:</span>
                                <span className="summary-value">{calculatedEndTime}</span>
                            </div>
                        )}
                    </div>
                </div>

                <button type="submit" className="submit-btn">
                    {submitLabel}
                </button>
            </form>
        </div>
    );
}