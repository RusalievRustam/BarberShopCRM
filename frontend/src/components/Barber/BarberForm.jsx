import React, { useState, useEffect, useRef } from "react";
import "./BarberForm.css";

export default function BarberForm({ initial = {}, onSubmit, submitLabel = "Сохранить" }) {
    const loaded = useRef(false);
    const [form, setForm] = useState({
        firstName: initial.firstName || "",
        lastName: initial.lastName || "",
        phone: initial.phone || "",
        status: initial.status || "ACTIVE"
    });

    useEffect(() => {
        if (!loaded.current) {
            setForm({
                firstName: initial.firstName || "",
                lastName: initial.lastName || "",
                phone: initial.phone || "",
                status: initial.status || "ACTIVE"
            });
            loaded.current = true;
        }
    }, [initial]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSubmit(form);
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit} className="barber-form">
                <div className="form-group">
                    <label htmlFor="firstName">Имя</label>
                    <input
                        id="firstName"
                        name="firstName"
                        placeholder="Введите имя"
                        value={form.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="lastName">Фамилия</label>
                    <input
                        id="lastName"
                        name="lastName"
                        placeholder="Введите фамилию"
                        value={form.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="phone">Телефон</label>
                    <input
                        id="phone"
                        name="phone"
                        placeholder="Введите телефон"
                        value={form.phone}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="status">Статус</label>
                    <select
                        id="status"
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                    >
                        <option value="ACTIVE">Активный</option>
                        <option value="INACTIVE">Неактивный</option>
                        <option value="ON_VACATION">В отпуске</option>
                    </select>
                </div>

                <button type="submit" className="submit-btn">
                    {submitLabel}
                </button>
            </form>
        </div>
    );
}