import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    adminCreatePayment,
    adminGetPayments,
    getBookings,
    cancelBooking,
    deleteBooking,
    isAdmin,
    searchByBarber,
    searchByClient
} from "../../services/api";
import "./Booking.css";

export default function Bookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchType, setSearchType] = useState("barber");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [paidByBookingId, setPaidByBookingId] = useState({});

    const admin = isAdmin();

    const toLocalYyyyMmDd = (date) => {
        const d = new Date(date);
        const yyyy = String(d.getFullYear());
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    };

    const loadBookings = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getBookings();
            setBookings(data);

            if (admin && Array.isArray(data) && data.length > 0) {
                const dates = data
                    .map((b) => b.startTime)
                    .filter(Boolean)
                    .map((t) => new Date(t));

                if (dates.length > 0) {
                    const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
                    const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));

                    const payments = await adminGetPayments(toLocalYyyyMmDd(minDate), toLocalYyyyMmDd(maxDate));
                    const map = {};
                    (payments || []).forEach((p) => {
                        if (p && p.bookingId) map[p.bookingId] = p;
                    });
                    setPaidByBookingId(map);
                }
            }
        } catch (e) {
            setError(e.message || "Ошибка загрузки записей");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBookings();
    }, []);

    const handleCancel = async (id) => {
        if (!confirm("Отменить запись?")) return;
        try {
            await cancelBooking(id);
            await loadBookings(); // Перезагружаем список
        } catch (e) {
            alert("Ошибка при отмене: " + (e.message || e.status));
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Удалить запись? Это действие нельзя отменить.")) return;
        try {
            await deleteBooking(id);
            setBookings(bookings.filter(b => b.id !== id));
        } catch (e) {
            alert("Ошибка при удалении: " + (e.message || e.status));
        }
    };

    const handlePay = async (booking) => {
        if (!admin) return;
        if (!booking?.id) return;

        if (paidByBookingId[booking.id]) {
            alert("Эта запись уже оплачена");
            return;
        }

        const method = (prompt("Метод оплаты: CASH или CARD", "CASH") || "").trim().toUpperCase();
        if (method !== "CASH" && method !== "CARD") {
            alert("Некорректный метод оплаты");
            return;
        }

        const amount = booking.finalAmount ?? "";
        if (!confirm(`Принять оплату ${amount ? `на сумму ${amount} сом ` : ""}методом ${method}?`)) return;

        try {
            setLoading(true);
            const payment = await adminCreatePayment(booking.id, method);
            setPaidByBookingId((prev) => ({ ...prev, [booking.id]: payment }));
            alert("Оплата принята");
        } catch (e) {
            alert("Ошибка при оплате: " + (e?.response?.data?.message || e.message || e.status));
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchKeyword.trim()) {
            loadBookings();
            return;
        }

        setLoading(true);
        try {
            let data;
            if (searchType === "barber") {
                data = await searchByBarber(searchKeyword);
            } else {
                data = await searchByClient(searchKeyword);
            }
            setBookings(data);
        } catch (e) {
            setError("Ошибка поиска: " + (e.message || e.status));
        } finally {
            setLoading(false);
        }
    };

    const handleClearSearch = () => {
        setSearchKeyword("");
        loadBookings();
    };

    const formatDateTime = (dateTime) => {
        if (!dateTime) return "";
        const date = new Date(dateTime);
        return date.toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'ACTIVE': { label: 'Запланировано', class: 'status-active' },
            'COMPLETED': { label: 'Завершено', class: 'status-completed' },
            'CANCELLED': { label: 'Отменено', class: 'status-cancelled' },
            'RESCHEDULED': { label: 'Перенесено', class: 'status-rescheduled' }
        };

        const config = statusConfig[status] || { label: status, class: 'status-default' };
        return <span className={`status-badge ${config.class}`}>{config.label}</span>;
    };

    const filteredBookings = bookings.filter(booking => {
        if (filterStatus === "ALL") return true;
        return booking.status === filterStatus;
    });

    const stats = {
        total: bookings.length,
        active: bookings.filter(b => b.status === 'ACTIVE').length,
        completed: bookings.filter(b => b.status === 'COMPLETED').length,
        rescheduled: bookings.filter(b => b.status === 'RESCHEDULED').length,
        cancelled: bookings.filter(b => b.status === 'CANCELLED').length
    };

    if (loading) return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Загрузка записей...</p>
        </div>
    );

    if (error) return (
        <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h3>Ошибка при загрузке</h3>
            <p>{error}</p>
            <button onClick={loadBookings} className="retry-btn">Попробовать снова</button>
        </div>
    );

    return (
        <div className="bookings-container">
            <div className="page-header">
                <h1>Записи на стрижку</h1>
                <p>Управление всеми бронированиями барбершопа</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">📅</div>
                    <div className="stat-content">
                        <span className="stat-number">{stats.total}</span>
                        <span className="stat-label">Всего записей</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                        <span className="stat-number">{stats.active}</span>
                        <span className="stat-label">Запланировано</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🏁</div>
                    <div className="stat-content">
                        <span className="stat-number">{stats.completed}</span>
                        <span className="stat-label">Завершено</span>
                    </div>
                </div>
            </div>

            <div className="controls-bar">
                <div className="search-section">
                    <div className="search-controls">
                        <select
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                            className="search-select"
                        >
                            <option value="barber">По барберу</option>
                            <option value="client">По клиенту</option>
                        </select>
                        <input
                            type="text"
                            placeholder={searchType === "barber" ? "Имя барбера..." : "Имя клиента..."}
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

                <div className="filters">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="filter-select"
                    >
                        <option value="ALL">Все статусы</option>
                        <option value="ACTIVE">Активно</option>
                        <option value="COMPLETED">Завершено</option>
                        <option value="CANCELLED">Отменено</option>
                        <option value="RESCHEDULED">Перенесено</option>
                    </select>
                </div>

                <Link to="/bookings/create" className="add-btn">
                    <span className="btn-icon">+</span>
                    Новая запись
                </Link>
            </div>

            {filteredBookings.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📅</div>
                    <h3>Записи не найдены</h3>
                    <p>{searchKeyword || filterStatus !== "ALL" ? "Попробуйте изменить фильтры" : "Создайте первую запись на стрижку"}</p>
                    {!searchKeyword && filterStatus === "ALL" && (
                        <Link to="/bookings/create" className="empty-btn">
                            Создать запись
                        </Link>
                    )}
                </div>
            ) : (
                <div className="table-container">
                    <table className="bookings-table">
                        <thead>
                        <tr>
                            <th>Клиент</th>
                            <th>Барбер</th>
                            <th>Услуга</th>
                            <th>Сумма</th>
                            <th>Время</th>
                            <th>Статус</th>
                            <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredBookings.map(booking => (
                            (() => {
                                const isPaid = Boolean(paidByBookingId[booking.id]);
                                return (
                            <tr key={booking.id} className={`booking-row status-${booking.status.toLowerCase()}`}>
                                <td>
                                    <div className="booking-client">
                                        <div className="client-name">{booking.clientName}</div>
                                    </div>
                                </td>
                                <td>
                                    <div className="booking-barber">{booking.barberName}</div>
                                </td>
                                <td>
                                    <div className="booking-procedure">{booking.procedureName}</div>
                                </td>
                                <td>
                                    <div className="booking-amount">
                                        {booking.finalAmount ?? "—"}
                                        {isPaid && <span className="payment-badge">Оплачено</span>}
                                    </div>
                                </td>
                                <td>
                                    <div className="booking-time">
                                        <div className="start-time">{formatDateTime(booking.startTime)}</div>
                                        <div className="end-time">
                                            до {formatDateTime(booking.endTime)}
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    {getStatusBadge(booking.status)}
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <Link
                                            to={`/bookings/${booking.id}/edit`}
                                            className="edit-btn"
                                        >
                                            Ред.
                                        </Link>
                                        {admin && booking.status !== 'CANCELLED' && (
                                            <button
                                                onClick={() => handlePay(booking)}
                                                className="pay-btn"
                                                disabled={isPaid}
                                                title={isPaid ? "Оплачено" : "Принять оплату"}
                                            >
                                                {isPaid ? "Оплачено" : "Оплатить"}
                                            </button>
                                        )}
                                        {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                                            <button
                                                onClick={() => handleCancel(booking.id)}
                                                className="cancel-btn"
                                            >
                                                Отменить
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(booking.id)}
                                            className="delete-btn"
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </td>
                            </tr>
                                );
                            })()
                        ))}
                        </tbody>
                    </table>
                    <div className="table-footer">
                        <span className="bookings-count">
                            Показано записей: {filteredBookings.length} из {bookings.length}
                        </span>
                        <div className="status-legend">
                            <span className="legend-item">
                                <span className="legend-color active"></span>
                                Запланировано
                            </span>
                            <span className="legend-item">
                                <span className="legend-color completed"></span>
                                Завершено
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}