import React, { useState, useEffect } from "react";
import "./ProcedureForm.css";

export default function ProcedureForm({
                                          initial = {},
                                          onSubmit,
                                          submitLabel = "Сохранить",
                                          categories = []
                                      }) {
    // Инициализируем форму с данными из initial
    const [form, setForm] = useState(() => ({
        procedureName: initial.procedureName || "",
        description: initial.description || "",
        price: initial.price || "",
        duration: initial.duration || "",
        categoryId: initial.categoryId || "",
        active: initial.active !== undefined ? initial.active : true
    }));

    const [errors, setErrors] = useState({});

    // Инициализация состояния формы происходит только один раз при монтировании компонента
    // через функцию-инициализатор в useState

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

        if (!form.procedureName.trim()) newErrors.procedureName = "Название обязательно";
        else if (form.procedureName.length < 2) newErrors.procedureName = "Минимум 2 символа";

        if (!form.price || isNaN(form.price) || parseFloat(form.price) <= 0) {
            newErrors.price = "Введите корректную цену";
        }

        if (!form.duration || isNaN(form.duration) || parseInt(form.duration) <= 0) {
            newErrors.duration = "Введите корректную продолжительность";
        }

        if (!form.categoryId) newErrors.categoryId = "Выберите категорию";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const payload = {
            procedureName: form.procedureName,
            description: form.description,
            price: parseFloat(form.price),
            duration: parseInt(form.duration),
            categoryId: parseInt(form.categoryId),
            active: form.active
        };

        await onSubmit(payload);
    };

    const getCategoryName = (categoryId) => {
        if (!categoryId) return "Не выбрана";

        const category = categories.find(c =>
            c.id === parseInt(categoryId) ||
            c.categoryId === parseInt(categoryId)
        );

        if (!category) return "Не найдена";

        if (typeof category === 'object') {
            return category.categoryName || category.name || category.category || "Без названия";
        }

        return category;
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit} className="procedure-form">
                <div className="form-section">
                    <h3 className="section-title">Информация об услуге</h3>

                    <div className="form-group">
                        <label htmlFor="procedureName">Название услуги *</label>
                        <input
                            id="procedureName"
                            name="procedureName"
                            placeholder="Например: Мужская стрижка"
                            value={form.procedureName}
                            onChange={handleChange}
                            className={errors.procedureName ? "error" : ""}
                        />
                        {errors.procedureName && <div className="error-message">{errors.procedureName}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Описание *</label>
                        <textarea
                            id="description"
                            name="description"
                            placeholder="Подробное описание услуги..."
                            value={form.description}
                            onChange={handleChange}
                            rows="4"
                            className={`notes-textarea ${errors.description ? "error" : ""}`}
                        />
                        {errors.description && <div className="error-message">{errors.description}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="price">Цена (Сом) *</label>
                        <input
                            id="price"
                            name="price"
                            type="number"
                            placeholder="1000"
                            value={form.price}
                            onChange={handleChange}
                            className={errors.price ? "error" : ""}
                            min="0"
                            step="50"
                        />
                        {errors.price && <div className="error-message">{errors.price}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="duration">Продолжительность (мин) *</label>
                        <input
                            id="duration"
                            name="duration"
                            type="number"
                            placeholder="45"
                            value={form.duration}
                            onChange={handleChange}
                            className={errors.duration ? "error" : ""}
                            min="5"
                            step="5"
                        />
                        {errors.duration && <div className="error-message">{errors.duration}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="categoryId">Категория *</label>
                        <select
                            id="categoryId"
                            name="categoryId"
                            value={form.categoryId}
                            onChange={handleChange}
                            className={errors.categoryId ? "error" : ""}
                        >
                            <option value="">Выберите категорию</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.categoryName}
                                </option>
                            ))}
                        </select>
                        {errors.categoryId && <div className="error-message">{errors.categoryId}</div>}
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
                            <span className="checkbox-text">Активная услуга</span>
                        </label>
                        <div className="checkbox-hint">
                            Неактивные услуги не будут отображаться при записи
                        </div>
                    </div>
                </div>

                <div className="procedure-summary">
                    <h3 className="section-title">Сводка услуги</h3>
                    <div className="summary-content">
                        <div className="summary-item">
                            <span className="summary-label">Услуга:</span>
                            <span className="summary-value">{form.procedureName || "Не указано"}</span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">Цена:</span>
                            <span className="summary-value">
                                {form.price ? `${parseInt(form.price).toLocaleString('ru-RU')} Сом` : "Не указано"}
                            </span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">Продолжительность:</span>
                            <span className="summary-value">
                                {form.duration ? `${form.duration} минут` : "Не указано"}
                            </span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">Категория:</span>
                            <span className="summary-value">{getCategoryName(form.categoryId)}</span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">Статус:</span>
                            <span className={`status-indicator ${form.active ? "active" : "inactive"}`}>
                                {form.active ? "Активна" : "Неактивна"}
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