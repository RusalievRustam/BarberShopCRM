import React, {useEffect, useState} from "react";
import {useParams, useNavigate, Link} from "react-router-dom";
import {getProcedureById, deleteProcedure} from "../../services/api";
import "./ProcedureDeatails.css";

export default function ProcedureDetails() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [procedure, setProcedure] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadProcedureDetails();
    }, [id]);

    const loadProcedureDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getProcedureById(id);
            setProcedure(data);
        } catch (e) {
            setError(e.message || "Ошибка загрузки деталей услуги");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm(`Удалить услугу "${procedure.name}"?`)) return;
        try {
            await deleteProcedure(id);
            alert("Услуга удалена");
            navigate("/procedures");
        } catch (e) {
            alert("Ошибка при удалении: " + (e.message || e.status));
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0
        }).format(price).replace('RUB', 'Сом');
    };

    const getCategoryBadge = (category) => {
        const categoryColors = {
            'СТРИЖКА': {bg: 'rgba(59, 130, 246, 0.1)', color: '#2563eb', border: 'rgba(59, 130, 246, 0.2)'},
            'БОРОДА': {bg: 'rgba(245, 158, 11, 0.1)', color: '#b45309', border: 'rgba(245, 158, 11, 0.2)'},
            'УХОД': {bg: 'rgba(16, 185, 129, 0.1)', color: '#047857', border: 'rgba(16, 185, 129, 0.2)'},
            'КОМПЛЕКС': {bg: 'rgba(139, 92, 246, 0.1)', color: '#6d28d9', border: 'rgba(139, 92, 246, 0.2)'}
        };

        const config = categoryColors[category] ||
            {bg: 'rgba(100, 116, 139, 0.1)', color: '#475569', border: 'rgba(100, 116, 139, 0.2)'};

        return (
            <span
                className="category-badge"
                style={{
                    background: config.bg,
                    color: config.color,
                    border: `1px solid ${config.border}`
                }}
            >
                {category || 'Без категории'}
            </span>
        );
    };

    const getStatusBadge = (active) => {
        if (active) {
            return <span className="status-badge status-active">Активна</span>;
        } else {
            return <span className="status-badge status-inactive">Неактивна</span>;
        }
    };

    if (loading) return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Загрузка деталей услуги...</p>
        </div>
    );

    if (error) return (
        <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h3>Ошибка при загрузке</h3>
            <p>{error}</p>
            <button onClick={() => navigate("/procedures")} className="back-btn">
                Вернуться к списку
            </button>
        </div>
    );

    if (!procedure) return (
        <div className="error-container">
            <div className="error-icon">✂️</div>
            <h3>Услуга не найдена</h3>
            <p>Запрошенная услуга не существует или была удалена</p>
            <button onClick={() => navigate("/procedures")} className="back-btn">
                Вернуться к списку
            </button>
        </div>
    );

    return (
        <div className="procedure-details-container">
            <div className="page-header">
                <Link to="/procedures" className="back-link">← Назад к списку</Link>
                <h1>Детали услуги #{procedure.id}</h1>
            </div>

            <div className="details-card">
                <div className="details-header">
                    <div className="header-left">
                        <h2>{procedure.name}</h2>
                        <p className="procedure-id">ID: {procedure.id}</p>
                    </div>
                    <div className="header-right">
                        {getStatusBadge(procedure.active)}
                    </div>
                </div>

                <div className="details-content">
                    <div className="info-grid">
                        <div className="info-section">
                            <h3>Основная информация</h3>
                            <div className="info-item">
                                <span className="info-label">Название:</span>
                                <span className="info-value">{procedure.name}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Категория:</span>
                                <span className="info-value">
        {getCategoryBadge(
            procedure.category && typeof procedure.category === 'object'
                ? procedure.category.categoryName  // Извлекаем только название
                : procedure.category
        )}
    </span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Статус:</span>
                                <span className="info-value">
                                    {procedure.active ? "Активна" : "Неактивна"}
                                </span>
                            </div>
                        </div>

                        <div className="info-section">
                            <h3>Стоимость и время</h3>
                            <div className="info-item">
                                <span className="info-label">Цена:</span>
                                <span className="info-value">
                                    {formatPrice(procedure.price)}
                                </span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Продолжительность:</span>
                                <span className="info-value">
                                    {procedure.duration} минут
                                </span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Средняя стоимость в минуту:</span>
                                <span className="info-value">
                                    {formatPrice(procedure.price / procedure.duration)}/мин
                                </span>
                            </div>
                        </div>
                    </div>

                    {procedure.description && (
                        <div className="description-section">
                            <h3>Подробное описание</h3>
                            <div className="description-content">
                                {procedure.description}
                            </div>
                        </div>
                    )}

                    <div className="actions-section">
                        <h3>Действия</h3>
                        <div className="action-buttons">
                            <Link
                                to={`/procedures/${procedure.id}/edit`}
                                className="edit-btn"
                            >
                                Редактировать услугу
                            </Link>

                            <button
                                onClick={() => navigate("/procedures")}
                                className="back-btn"
                            >
                                Вернуться к списку
                            </button>

                            <button
                                onClick={handleDelete}
                                className="delete-btn"
                            >
                                Удалить услугу
                            </button>
                        </div>
                    </div>
                </div>

                <div className="details-footer">
                    <div className="footer-info">
                        <span className="stat-info">
                            Всего записей с этой услугой: {/* Можно добавить счетчик если будет API */}
                        </span>
                        <span className="revenue-info">
                            Общий доход: {/* Можно добавить если будет API для статистики */}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}