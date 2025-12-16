import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBarbers } from "../../services/api";
import "../PageLayout.css";
import "./WorkScheduleHome.css";

export default function WorkScheduleHome() {
    const navigate = useNavigate();
    const [barbers, setBarbers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [query, setQuery] = useState("");

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError("");
            try {
                const data = await getBarbers();
                setBarbers(data || []);
            } catch (e) {
                setError(e?.response?.data?.message || e.message || "Ошибка загрузки барберов");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return barbers;
        return barbers.filter((b) => {
            const name = `${b.firstName || ""} ${b.lastName || ""}`.trim().toLowerCase();
            const phone = String(b.phone || "").toLowerCase();
            return name.includes(q) || phone.includes(q);
        });
    }, [barbers, query]);

    const openWorkSchedule = (barberId) => {
        navigate(`/barbers/${barberId}/work-schedule`);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Загрузка...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-icon">⚠️</div>
                <h3>Ошибка</h3>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="page-layout">
            <div className="page-header">
                <h1>График мастеров</h1>
                <p>Выберите барбера, чтобы редактировать рабочее расписание</p>
            </div>

            <div className="work-schedule-toolbar">
                <input
                    className="work-schedule-search"
                    placeholder="Поиск по имени или телефону"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            {filtered.length === 0 ? (
                <div className="work-schedule-empty">Барберы не найдены</div>
            ) : (
                <div className="work-schedule-grid">
                    {filtered.map((b) => (
                        <button
                            key={b.id}
                            type="button"
                            className="work-schedule-card"
                            onClick={() => openWorkSchedule(b.id)}
                        >
                            <div className="work-schedule-avatar">
                                {(b.firstName?.charAt(0) || "").toUpperCase()}
                                {(b.lastName?.charAt(0) || "").toUpperCase()}
                            </div>
                            <div className="work-schedule-meta">
                                <div className="work-schedule-name">
                                    {b.firstName} {b.lastName}
                                </div>
                                <div className="work-schedule-sub">📱 {b.phone}</div>
                                <div className="work-schedule-sub">Статус: {b.status}</div>
                            </div>
                            <div className="work-schedule-cta">Открыть →</div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
