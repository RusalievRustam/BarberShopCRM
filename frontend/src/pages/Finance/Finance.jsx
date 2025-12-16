import React, { useEffect, useMemo, useState } from "react";
import {
    adminGetPayments,
    adminGetRevenue,
    adminGetRevenueByBarber
} from "../../services/api";
import "./Finance.css";

function toLocalYyyyMmDd(date) {
    const d = new Date(date);
    const yyyy = String(d.getFullYear());
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

function formatMoney(value) {
    if (value === null || value === undefined || value === "") return "—";
    const num = Number(value);
    if (Number.isNaN(num)) return String(value);
    return new Intl.NumberFormat("ru-RU").format(num);
}

export default function Finance() {
    const today = useMemo(() => new Date(), []);

    const [startDate, setStartDate] = useState(toLocalYyyyMmDd(today));
    const [endDate, setEndDate] = useState(toLocalYyyyMmDd(today));

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [revenue, setRevenue] = useState(null);
    const [payments, setPayments] = useState([]);
    const [barberRevenue, setBarberRevenue] = useState([]);

    const load = async () => {
        setLoading(true);
        setError("");
        try {
            const [rev, pays, byBarber] = await Promise.all([
                adminGetRevenue(startDate, endDate),
                adminGetPayments(startDate, endDate),
                adminGetRevenueByBarber(startDate, endDate)
            ]);
            setRevenue(rev);
            setPayments(pays || []);
            setBarberRevenue(byBarber || []);
        } catch (e) {
            setError(e?.response?.data?.message || e.message || "Ошибка загрузки финансовых данных");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const maxBarberRevenue = useMemo(() => {
        if (!barberRevenue || barberRevenue.length === 0) return 0;
        return Math.max(...barberRevenue.map((x) => Number(x.totalRevenue) || 0));
    }, [barberRevenue]);

    return (
        <div className="finance-page">
            <div className="finance-header">
                <h1>Финансы</h1>
                <p>Выручка, платежи и отчёт по мастерам</p>
            </div>

            <div className="finance-filters">
                <div className="filter-group">
                    <label>Дата с</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    <label>Дата по</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <button className="finance-btn" onClick={load} disabled={loading}>
                    {loading ? "Загрузка..." : "Показать"}
                </button>
            </div>

            {error && (
                <div className="finance-error">
                    {error}
                </div>
            )}

            <div className="finance-grid">
                <div className="finance-card">
                    <div className="card-title">Выручка за период</div>
                    <div className="card-value">{formatMoney(revenue?.totalRevenue)} сом</div>
                    <div className="card-sub">
                        Платежей: <b>{revenue?.paymentsCount ?? 0}</b>
                    </div>
                </div>

                <div className="finance-card">
                    <div className="card-title">Средний чек</div>
                    <div className="card-value">
                        {revenue && revenue.paymentsCount ? (
                            `${formatMoney(Number(revenue.totalRevenue) / Number(revenue.paymentsCount))} сом`
                        ) : (
                            "—"
                        )}
                    </div>
                    <div className="card-sub">
                        Диапазон: <b>{startDate}</b> — <b>{endDate}</b>
                    </div>
                </div>
            </div>

            <div className="finance-section">
                <h2>Отчёт по мастерам</h2>
                {barberRevenue.length === 0 ? (
                    <div className="finance-empty">Нет данных за период</div>
                ) : (
                    <div className="barber-report">
                        {barberRevenue.map((row) => {
                            const total = Number(row.totalRevenue) || 0;
                            const width = maxBarberRevenue > 0 ? Math.round((total / maxBarberRevenue) * 100) : 0;
                            return (
                                <div key={row.barberId} className="barber-row">
                                    <div className="barber-name">{row.barberName}</div>
                                    <div className="barber-bar">
                                        <div className="barber-bar-fill" style={{ width: `${width}%` }} />
                                    </div>
                                    <div className="barber-sum">{formatMoney(row.totalRevenue)} сом</div>
                                    <div className="barber-count">{row.paymentsCount} оплат</div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="finance-section">
                <h2>Платежи</h2>
                {payments.length === 0 ? (
                    <div className="finance-empty">Платежей за период нет</div>
                ) : (
                    <div className="finance-table-wrap">
                        <table className="finance-table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Booking ID</th>
                                <th>Сумма</th>
                                <th>Метод</th>
                                <th>Статус</th>
                                <th>Дата оплаты</th>
                            </tr>
                            </thead>
                            <tbody>
                            {payments.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>{p.bookingId}</td>
                                    <td>{formatMoney(p.amount)} сом</td>
                                    <td>{p.method}</td>
                                    <td>{p.status}</td>
                                    <td>{p.paidAt ? new Date(p.paidAt).toLocaleString("ru-RU") : "—"}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
