import React, { useState, useEffect, useRef } from "react";
import "./ClientForm.css";

export default function ClientForm({ initial = {}, onSubmit, submitLabel = "Сохранить" }) {
    const loaded = useRef(false);
    const [form, setForm] = useState({
        firstName: initial.firstName || "",
        lastName: initial.lastName || "",
        phoneNumber: initial.phoneNumber || "",
        notes: initial.notes || ""
    });

    useEffect(() => {
        if (!loaded.current) {
            setForm({
                firstName: initial.firstName || "",
                lastName: initial.lastName || "",
                phoneNumber: initial.phoneNumber || "",
                notes: initial.notes || ""
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
            <form onSubmit={handleSubmit} className="client-form">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="firstName">Имя *</label>
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
                        <label htmlFor="lastName">Фамилия *</label>
                        <input
                            id="lastName"
                            name="lastName"
                            placeholder="Введите фамилию"
                            value={form.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="phoneNumber">Телефон *</label>
                    <input
                        id="phoneNumber"
                        name="phoneNumber"
                        placeholder="+996 (XXX) XX-XX-XX"
                        value={form.phoneNumber}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="notes">Комментарии</label>
                    <textarea
                        id="notes"
                        name="notes"
                        placeholder="Дополнительная информация о клиенте..."
                        value={form.notes}
                        onChange={handleChange}
                        rows="4"
                        className="notes-textarea"
                    />
                </div>

                <button type="submit" className="submit-btn">
                    {submitLabel}
                </button>
            </form>
        </div>
    );
}