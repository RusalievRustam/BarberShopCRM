import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getClients, deleteClient, searchClients, searchByPhone } from "../../services/api";
import "./Clients.css";

export default function Clients() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchType, setSearchType] = useState("name");
    const [searchKeyword, setSearchKeyword] = useState("");

    const loadClients = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getClients();
            setClients(data);
        } catch (e) {
            setError(e.message || "Ошибка загрузки клиентов");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadClients();
    }, []);

    const handleDelete = async (id, name) => {
        if (!confirm(`Удалить клиента ${name}?`)) return;
        try {
            await deleteClient(id);
            setClients(clients.filter(c => c.id !== id));
        } catch (e) {
            alert("Ошибка при удалении: " + (e.message || e.status));
        }
    };

    const handleSearch = async () => {
        if (!searchKeyword.trim()) {
            loadClients();
            return;
        }

        setLoading(true);
        try {
            let data;
            if (searchType === "phone") {
                data = await searchByPhone(searchKeyword);
            } else {
                data = await searchClients(searchKeyword);
            }
            setClients(data);
        } catch (e) {
            setError("Ошибка поиска: " + (e.message || e.status));
        } finally {
            setLoading(false);
        }
    };

    const handleClearSearch = () => {
        setSearchKeyword("");
        loadClients();
    };

    const formatPhoneNumber = (phone) => {
        if (!phone) return "";
        const cleaned = phone.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);
        if (match) {
            return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
        }
        return phone;
    };

    const truncateText = (text, maxLength = 50) => {
        if (!text) return "";
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    };

    if (loading) return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Загрузка клиентов...</p>
        </div>
    );

    if (error) return (
        <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h3>Ошибка при загрузке</h3>
            <p>{error}</p>
            <button onClick={loadClients} className="retry-btn">Попробовать снова</button>
        </div>
    );

    return (
        <div className="clients-container">
            <div className="page-header">
                <h1>Клиенты</h1>
                <p>Управление базой клиентов барбершопа</p>
            </div>

            <div className="controls-bar">
                <div className="search-section">
                    <div className="search-controls">
                        <select
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                            className="search-select"
                        >
                            <option value="name">По имени</option>
                            <option value="phone">По телефону</option>
                        </select>
                        <input
                            type="text"
                            placeholder={searchType === "phone" ? "Введите номер телефона..." : "Поиск клиентов..."}
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            className="search-input"
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button onClick={handleSearch} className="search-btn">
                            🔍
                        </button>
                        {searchKeyword && (
                            <button onClick={handleClearSearch} className="clear-btn">
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                <Link to="/clients/create" className="add-btn">
                    <span className="btn-icon">+</span>
                    Добавить клиента
                </Link>
            </div>

            {clients.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">👤</div>
                    <h3>Клиенты не найдены</h3>
                    <p>{searchKeyword ? "Попробуйте изменить поисковый запрос" : "Добавьте первого клиента в базу"}</p>
                    {!searchKeyword && (
                        <Link to="/clients/create" className="empty-btn">
                            Добавить клиента
                        </Link>
                    )}
                </div>
            ) : (
                <div className="table-container">
                    <table className="clients-table">
                        <thead>
                        <tr>
                            <th>Клиент</th>
                            <th>Телефон</th>
                            <th>Комментарии</th>
                            <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {clients.map(client => (
                            <tr key={client.id}>
                                <td>
                                    <div className="client-info">
                                        <div className="client-name">
                                            {client.firstName} {client.lastName}
                                        </div>
                                        <div className="client-id">
                                            ID: {client.id}
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="phone-cell">
                                        {formatPhoneNumber(client.phoneNumber)}
                                    </div>
                                </td>
                                <td>
                                    <div className="notes-cell" title={client.notes || ""}>
                                        {client.notes ? (
                                            <>
                                                {truncateText(client.notes)}
                                                {client.notes.length > 50 && (
                                                    <span className="notes-more">читать</span>
                                                )}
                                            </>
                                        ) : (
                                            <span className="no-notes">—</span>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <Link
                                            to={`/clients/${client.id}/edit`}
                                            className="edit-btn"
                                        >
                                            Редактировать
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(client.id, `${client.firstName} ${client.lastName}`)}
                                            className="delete-btn"
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
                        <span className="clients-count">
                            Найдено клиентов: {clients.length}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}