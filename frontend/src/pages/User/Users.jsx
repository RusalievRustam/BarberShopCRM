import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUsers, deleteUser, getRoles } from "../../services/api";
import "./Users.css";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [roles, setRoles] = useState([]);

    const loadUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const [usersData, rolesData] = await Promise.all([
                getUsers(),
                getRoles()
            ]);
            setUsers(usersData);
            setRoles(rolesData || []);
        } catch (e) {
            setError(e.message || "Ошибка загрузки пользователей");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleDelete = async (id, username) => {
        if (!confirm(`Удалить пользователя ${username}?`)) return;
        try {
            await deleteUser(id);
            setUsers(users.filter(u => u.id !== id));
        } catch (e) {
            alert("Ошибка при удалении: " + (e.message || e.status));
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getRoleBadge = (role) => {
        const roleColors = {
            'ADMIN': { bg: 'rgba(239, 68, 68, 0.1)', color: '#dc2626', border: 'rgba(239, 68, 68, 0.2)' },
            'MANAGER': { bg: 'rgba(59, 130, 246, 0.1)', color: '#2563eb', border: 'rgba(59, 130, 246, 0.2)' },
            'USER': { bg: 'rgba(16, 185, 129, 0.1)', color: '#047857', border: 'rgba(16, 185, 129, 0.2)' }
        };

        const config = roleColors[role?.name?.toUpperCase()] ||
            { bg: 'rgba(100, 116, 139, 0.1)', color: '#475569', border: 'rgba(100, 116, 139, 0.2)' };

        return (
            <span
                className="role-badge"
                style={{
                    background: config.bg,
                    color: config.color,
                    border: `1px solid ${config.border}`
                }}
            >
                {role?.name || 'Без роли'}
            </span>
        );
    };

    if (loading) return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Загрузка пользователей...</p>
        </div>
    );

    if (error) return (
        <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h3>Ошибка при загрузке</h3>
            <p>{error}</p>
            <button onClick={loadUsers} className="retry-btn">Попробовать снова</button>
        </div>
    );

    return (
        <div className="users-container">
            <div className="page-header">
                <h1>Пользователи системы</h1>
                <p>Управление доступом к административной панели</p>
            </div>

            <div className="admin-info">
                <div className="admin-card">
                    <div className="admin-icon">👑</div>
                    <div className="admin-content">
                        <h3>Административная зона</h3>
                        <p>Здесь вы можете управлять пользователями и их правами доступа</p>
                    </div>
                </div>
            </div>

            <div className="controls-bar">
                <div className="stats">
                    <div className="stat-item">
                        <span className="stat-number">{users.length}</span>
                        <span className="stat-label">Всего пользователей</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">
                            {users.filter(u => u.role?.name === 'ADMIN').length}
                        </span>
                        <span className="stat-label">Администраторов</span>
                    </div>
                </div>

                <Link to="/admin/users/create" className="add-btn">
                    <span className="btn-icon">+</span>
                    Добавить пользователя
                </Link>
            </div>

            {users.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">👤</div>
                    <h3>Пользователи не найдены</h3>
                    <p>Добавьте первого пользователя в систему</p>
                    <Link to="/admin/users/create" className="empty-btn">
                        Добавить пользователя
                    </Link>
                </div>
            ) : (
                <div className="table-container">
                    <table className="users-table">
                        <thead>
                        <tr>
                            <th>Пользователь</th>
                            <th>Роль</th>
                            <th>Дата создания</th>
                            <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>
                                    <div className="user-info">
                                        <div className="user-username">
                                            {user.username}
                                        </div>
                                        <div className="user-id">
                                            ID: {user.id}
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    {getRoleBadge(user.role)}
                                </td>
                                <td>
                                    <div className="date-cell">
                                        {formatDate(user.createdAt)}
                                    </div>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <Link
                                            to={`/admin/users/${user.id}/edit`}
                                            className="edit-btn"
                                        >
                                            Редактировать
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(user.id, user.username)}
                                            className="delete-btn"
                                            disabled={user.role?.name === 'ADMIN' && users.filter(u => u.role?.name === 'ADMIN').length === 1}
                                            title={user.role?.name === 'ADMIN' && users.filter(u => u.role?.name === 'ADMIN').length === 1 ?
                                                "Нельзя удалить последнего администратора" : ""}
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
                        <span className="users-count">
                            Показано пользователей: {users.length}
                        </span>
                        <div className="role-legend">
                            <span className="legend-item">
                                <span className="legend-color admin"></span>
                                Администратор
                            </span>
                            <span className="legend-item">
                                <span className="legend-color manager"></span>
                                Менеджер
                            </span>
                            <span className="legend-item">
                                <span className="legend-color user"></span>
                                Пользователь
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}