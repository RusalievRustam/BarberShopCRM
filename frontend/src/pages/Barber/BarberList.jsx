import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {getBarbers, deleteBarber} from "../../services/api.js";
import "./BarberList.css";

export default function BarberList() {
    const [barbers, setBarbers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadBarbers = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getBarbers();
            setBarbers(data);
        } catch (e) {
            setError(e.message || "Ошибка загрузки");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBarbers();
    }, []);

    const handleDelete = async (id, name) => {
        if (!confirm(`Удалить барбера ${name}?`)) return;
        try {
            await deleteBarber(id);
            setBarbers(barbers.filter(b => b.id !== id));
        } catch (e) {
            alert("Ошибка при удалении: " + (e.message || e.status));
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            ACTIVE: {label: "Активный", class: "status-active"},
            INACTIVE: {label: "Неактивный", class: "status-inactive"},
            ON_VACATION: {label: "В отпуске", class: "status-vacation"}
        };
        const config = statusConfig[status] || {label: status, class: "status-default"};
        return <span className={`status-badge ${config.class}`}>{config.label}</span>;
    };

    if (loading) return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Загрузка барберов...</p>
        </div>
    );

    if (error) return (
        <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h3>Ошибка при загрузке</h3>
            <p>{error}</p>
            <button onClick={loadBarbers} className="retry-btn">Попробовать снова</button>
        </div>
    );

    return (
        <div className="barber-list">
            <div className="page-header">
                <h1>Наши барберы</h1>
                <p>Выберите барбера и запишитесь на удобное время</p>
            </div>

            <div className="actions-bar">
                <Link to="/barbers/create" className="add-btn">
                    <span className="btn-icon">+</span>
                    Добавить барбера
                </Link>
            </div>

            {barbers.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">💈</div>
                    <h3>Пока нет барберов</h3>
                    <p>Добавьте первого барбера в вашу команду</p>
                    <Link to="/barbers/create" className="empty-btn">
                        Добавить барбера
                    </Link>
                </div>
            ) : (
                <div className="barber-cards">
                    {barbers.map((barber) => (
                        <div key={barber.id} className="barber-card">
                            <div className="barber-card-top">
                                <div className="barber-avatar">
                                    {barber.firstName?.charAt(0)}{barber.lastName?.charAt(0)}
                                </div>
                                <div className="barber-meta">
                                    <div className="barber-name">
                                        {barber.firstName} {barber.lastName}
                                    </div>
                                    <div className="barber-phone">📱 {barber.phone}</div>
                                    <div className="barber-status-row">{getStatusBadge(barber.status)}</div>
                                </div>
                            </div>

                            <div className="barber-card-actions">
                                <Link
                                    to={`/barbers/${barber.id}/schedule`}
                                    className="book-btn"
                                    title="Выбрать время и записаться"
                                >
                                    Записаться
                                </Link>

                                <Link to={`/barbers/${barber.id}/edit`} className="edit-btn">
                                    Редактировать
                                </Link>

                                <button
                                    onClick={() => handleDelete(barber.id, `${barber.firstName} ${barber.lastName}`)}
                                    className="delete-btn"
                                >
                                    Удалить
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}