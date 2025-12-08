import React, { useState, useEffect, useRef } from "react";
import "./UserForm.css";

export default function UserForm({ initial = {}, onSubmit, submitLabel = "Сохранить", roles = [] }) {
    const loaded = useRef(false);
    const [form, setForm] = useState({
        username: initial.username || "",
        password: initial.password || "",
        confirmPassword: "",
        roleId: initial.role?.id || ""
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (!loaded.current) {
            setForm({
                username: initial.username || "",
                password: initial.password || "",
                confirmPassword: "",
                roleId: initial.role?.id || ""
            });
            loaded.current = true;
        }
    }, [initial]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));

        // Очищаем ошибку при изменении поля
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!form.username.trim()) {
            newErrors.username = "Имя пользователя обязательно";
        } else if (form.username.length < 3) {
            newErrors.username = "Минимум 3 символа";
        }

        if (!form.password && !initial.id) {
            newErrors.password = "Пароль обязателен";
        } else if (form.password && form.password.length < 6) {
            newErrors.password = "Минимум 6 символов";
        }

        if (!initial.id && form.password !== form.confirmPassword) {
            newErrors.confirmPassword = "Пароли не совпадают";
        }

        if (!form.roleId) {
            newErrors.roleId = "Выберите роль";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Для обновления пользователя не отправляем пароль, если он не изменен
        const payload = {
            username: form.username,
            roleId: parseInt(form.roleId)
        };

        if (form.password && (!initial.id || form.password !== initial.password)) {
            payload.password = form.password;
        }

        await onSubmit(payload);
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit} className="user-form">
                <div className="form-group">
                    <label htmlFor="username">
                        Имя пользователя *
                        <span className="field-info"> (уникальное)</span>
                    </label>
                    <input
                        id="username"
                        name="username"
                        placeholder="Введите логин"
                        value={form.username}
                        onChange={handleChange}
                        className={errors.username ? "error" : ""}
                    />
                    {errors.username && <div className="error-message">{errors.username}</div>}
                </div>

                {!initial.id && (
                    <>
                        <div className="form-group">
                            <label htmlFor="password">Пароль *</label>
                            <div className="password-input-container">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Минимум 6 символов"
                                    value={form.password}
                                    onChange={handleChange}
                                    className={errors.password ? "error" : ""}
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </button>
                            </div>
                            {errors.password && <div className="error-message">{errors.password}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Подтвердите пароль *</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                placeholder="Повторите пароль"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                className={errors.confirmPassword ? "error" : ""}
                            />
                            {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
                        </div>
                    </>
                )}

                {initial.id && (
                    <div className="form-group">
                        <label htmlFor="password">Новый пароль (оставьте пустым, чтобы не менять)</label>
                        <div className="password-input-container">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Введите новый пароль"
                                value={form.password}
                                onChange={handleChange}
                                className={errors.password ? "error" : ""}
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </button>
                        </div>
                        {errors.password && <div className="error-message">{errors.password}</div>}
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="roleId">Роль *</label>
                    <select
                        id="roleId"
                        name="roleId"
                        value={form.roleId}
                        onChange={handleChange}
                        className={errors.roleId ? "error" : ""}
                    >
                        <option value="">Выберите роль</option>
                        {roles.map(role => (
                            <option key={role.id} value={role.id}>
                                {role.name}
                            </option>
                        ))}
                    </select>
                    {errors.roleId && <div className="error-message">{errors.roleId}</div>}
                </div>

                <button type="submit" className="submit-btn">
                    {submitLabel}
                </button>
            </form>
        </div>
    );
}