import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format, addDays, addMinutes } from "date-fns";
import { ru } from "date-fns/locale";
import {
    createBooking,
    getBarberAvailability,
    getBarberById,
    getBarberWeeklySchedule,
    getClients,
    getProcedures
} from "../../services/api";
import "./BarberBooking.css";

function toDateInputValue(d) {
    return format(d, "yyyy-MM-dd");
}

function toLocalDateTimeString(date, timeStr) {
    // backend ожидает pattern yyyy-MM-dd'T'HH:mm
    const [hh, mm] = timeStr.split(":").map(Number);
    const dt = new Date(date);
    dt.setHours(hh, mm, 0, 0);
    return format(dt, "yyyy-MM-dd'T'HH:mm");
}

function normalizeTimeString(t) {
    // LocalTime часто приходит как "HH:mm:ss" — приводим к "HH:mm"
    if (typeof t !== "string") return "";
    return t.slice(0, 5);
}

export default function BarberBooking() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [barber, setBarber] = useState(null);
    const [weeklySchedule, setWeeklySchedule] = useState([]);

    const [clients, setClients] = useState([]);
    const [procedures, setProcedures] = useState([]);

    const [selectedClientId, setSelectedClientId] = useState("");
    const [selectedProcedureId, setSelectedProcedureId] = useState("");

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [availabilitySlots, setAvailabilitySlots] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const selectedProcedure = useMemo(() => {
        const pid = Number(selectedProcedureId);
        return procedures.find((p) => p.id === pid) || null;
    }, [procedures, selectedProcedureId]);

    const durationMinutes = selectedProcedure?.duration || 60;

    useEffect(() => {
        const loadBase = async () => {
            try {
                setLoading(true);
                setError("");

                const [barberData, weekly, clientsData, proceduresData] = await Promise.all([
                    getBarberById(id),
                    getBarberWeeklySchedule(id),
                    getClients(),
                    getProcedures()
                ]);

                setBarber(barberData);
                setWeeklySchedule(weekly || []);
                setClients(clientsData || []);
                setProcedures(proceduresData || []);

                if ((clientsData || []).length > 0) setSelectedClientId(String(clientsData[0].id));
                if ((proceduresData || []).length > 0) setSelectedProcedureId(String(proceduresData[0].id));
            } catch (e) {
                setError("Не удалось загрузить данные страницы записи");
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        loadBase();
    }, [id]);

    useEffect(() => {
        const loadAvailability = async () => {
            if (!barber) return;

            try {
                setLoading(true);
                setError("");

                const slots = await getBarberAvailability(id, selectedDate);
                setAvailabilitySlots(slots || []);
            } catch (e) {
                setError("Не удалось загрузить слоты на выбранный день");
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        loadAvailability();
    }, [id, barber, selectedDate]);

    const candidates = useMemo(() => {
        // строим кандидаты с шагом 30 минут из availabilitySlots
        if (!availabilitySlots || availabilitySlots.length === 0) return [];

        const slots = availabilitySlots
            .map((s) => ({
                start: normalizeTimeString(s.startTime),
                end: normalizeTimeString(s.endTime),
                available: Boolean(s.available)
            }))
            .filter((s) => s.start && s.end);

        const slotMap = new Map(slots.map((s) => [s.start, s]));

        const result = [];
        for (const s of slots) {
            // candidate start time
            const start = s.start;

            // Проверяем, что на протяжении durationMinutes все 30-мин отрезки свободны
            const startDt = new Date(selectedDate);
            const [sh, sm] = start.split(":").map(Number);
            startDt.setHours(sh, sm, 0, 0);

            const endDt = addMinutes(startDt, durationMinutes);

            let ok = true;
            let cursor = new Date(startDt);
            while (cursor < endDt) {
                const key = format(cursor, "HH:mm");
                const seg = slotMap.get(key);
                if (!seg || !seg.available) {
                    ok = false;
                    break;
                }
                cursor = addMinutes(cursor, 30);
            }

            // Важно: не даем записываться в прошлое
            if (ok && startDt < new Date()) ok = false;

            result.push({
                time: start,
                isAvailable: ok,
                isBusy: !ok
            });
        }

        // Убираем повторы по времени (на всякий)
        const uniq = new Map();
        for (const r of result) {
            if (!uniq.has(r.time)) uniq.set(r.time, r);
        }
        return Array.from(uniq.values()).sort((a, b) => a.time.localeCompare(b.time));
    }, [availabilitySlots, durationMinutes, selectedDate]);

    const handleBook = async (time) => {
        if (!selectedClientId || !selectedProcedureId) {
            setError("Выберите клиента и услугу");
            return;
        }

        const startTime = toLocalDateTimeString(selectedDate, time);

        if (!window.confirm(`Записать клиента на ${time} (${format(selectedDate, "d MMMM yyyy", { locale: ru })})?`)) {
            return;
        }

        try {
            setLoading(true);
            setError("");

            await createBooking({
                clientId: Number(selectedClientId),
                barberId: Number(id),
                procedureId: Number(selectedProcedureId),
                startTime,
                status: "ACTIVE"
            });

            alert("Запись успешно создана!");

            // Перезагружаем доступность, чтобы слот сразу стал занятым
            const slots = await getBarberAvailability(id, selectedDate);
            setAvailabilitySlots(slots || []);
        } catch (e) {
            setError(e?.response?.data?.message || e.message || "Ошибка при создании записи");
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="bb-loading">Загрузка...</div>;
    if (error) return <div className="bb-error">{error}</div>;
    if (!barber) return <div className="bb-error">Барбер не найден</div>;

    return (
        <div className="bb-page">
            <div className="bb-header">
                <button className="bb-back" onClick={() => navigate("/barbers")}>
                    ← Назад
                </button>
                <div>
                    <h1 className="bb-title">Запись к барберу</h1>
                    <div className="bb-subtitle">
                        {barber.firstName} {barber.lastName}
                    </div>
                </div>
            </div>

            <div className="bb-controls">
                <div className="bb-control">
                    <label>Клиент</label>
                    <select value={selectedClientId} onChange={(e) => setSelectedClientId(e.target.value)}>
                        <option value="">Выберите клиента</option>
                        {clients.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.firstName} {c.lastName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="bb-control">
                    <label>Услуга</label>
                    <select value={selectedProcedureId} onChange={(e) => setSelectedProcedureId(e.target.value)}>
                        <option value="">Выберите услугу</option>
                        {procedures.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.procedureName} ({p.duration} мин.)
                            </option>
                        ))}
                    </select>
                </div>

                <div className="bb-control">
                    <label>Дата</label>
                    <div className="bb-date-row">
                        <button className="bb-date-btn" onClick={() => setSelectedDate((d) => addDays(d, -1))}>
                            −
                        </button>
                        <input
                            type="date"
                            value={toDateInputValue(selectedDate)}
                            onChange={(e) => setSelectedDate(new Date(e.target.value + "T00:00:00"))}
                        />
                        <button className="bb-date-btn" onClick={() => setSelectedDate((d) => addDays(d, 1))}>
                            +
                        </button>
                    </div>
                    <div className="bb-date-human">
                        {format(selectedDate, "EEEE, d MMMM yyyy", { locale: ru })}
                    </div>
                </div>
            </div>

            <div className="bb-legend">
                <span className="bb-pill bb-pill-available">Свободно</span>
                <span className="bb-pill bb-pill-busy">Занято/недоступно</span>
            </div>

            <div className="bb-slots">
                {candidates.length > 0 ? (
                    candidates.map((c) => (
                        <button
                            key={c.time}
                            className={c.isAvailable ? "bb-slot bb-slot-available" : "bb-slot bb-slot-busy"}
                            disabled={!c.isAvailable}
                            onClick={() => handleBook(c.time)}
                        >
                            {c.time}
                        </button>
                    ))
                ) : (
                    <div className="bb-empty">
                        На выбранную дату барбер не работает или все слоты заняты.
                    </div>
                )}
            </div>

            <div className="bb-week">
                <h2>График работы (неделя)</h2>
                <div className="bb-week-table">
                    <table>
                        <thead>
                            <tr>
                                <th>День</th>
                                <th>Начало</th>
                                <th>Конец</th>
                                <th>Активен</th>
                            </tr>
                        </thead>
                        <tbody>
                            {weeklySchedule.map((d, idx) => (
                                <tr key={idx} className={!d.available ? "bb-row-off" : ""}>
                                    <td>{String(d.dayOfWeek)}</td>
                                    <td>{d.startTime ? String(d.startTime).slice(0, 5) : "—"}</td>
                                    <td>{d.endTime ? String(d.endTime).slice(0, 5) : "—"}</td>
                                    <td>{d.available ? "Да" : "Нет"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
