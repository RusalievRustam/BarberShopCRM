import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BookingForm from "../../components/Booking/BookingForm";
import { getBookingById, updateBooking, getClients, getBarbers, getProcedures } from "../../services/api";
import "../PageLayout.css";

export default function EditBooking() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [initial, setInitial] = useState(null);
    const [clients, setClients] = useState([]);
    const [barbers, setBarbers] = useState([]);
    const [procedures, setProcedures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const [bookingData, clientsData, barbersData, proceduresData] = await Promise.all([
                getBookingById(id),
                getClients(),
                getBarbers(),
                getProcedures()
            ]);

            // Преобразуем данные для формы
            const client = clientsData.find(c =>
                `${c.firstName} ${c.lastName}` === bookingData.clientName
            );
            const barber = barbersData.find(b =>
                `${b.firstName} ${b.lastName}` === bookingData.barberName
            );
            const procedure = proceduresData.find(p =>
                p.name === bookingData.procedureName
            );

            setInitial({
                ...bookingData,
                clientId: client?.id || "",
                barberId: barber?.id || "",
                procedureId: procedure?.id || ""
            });

            setClients(clientsData || []);
            setBarbers(barbersData || []);
            setProcedures(proceduresData || []);
        } catch (e) {
            console.error("Ошибка загрузки данных:", e);
            setError("Не удалось загрузить данные записи");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (payload) => {
        try {
            await updateBooking(id, payload);
            alert("Изменения сохранены!");
            navigate("/bookings");
        } catch (e) {
            alert("Ошибка при сохранении: " + (e.message || e.status));
        }
    };

    if (loading) return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Загрузка данных...</p>
        </div>
    );

    if (error) return (
        <div className="error-container">
            <div className="error-icon">❌</div>
            <h3>Ошибка загрузки</h3>
            <p>{error}</p>
            <button onClick={() => navigate("/bookings")} className="retry-btn">
                Вернуться к списку
            </button>
        </div>
    );

    if (!initial) return (
        <div className="error-container">
            <div className="error-icon">📅</div>
            <h3>Запись не найдена</h3>
            <p>Запрошенная запись не существует или была удалена</p>
            <button onClick={() => navigate("/bookings")} className="retry-btn">
                Вернуться к списку
            </button>
        </div>
    );

    return (
        <div className="page-layout">
            <div className="page-header">
                <h1>Редактировать запись</h1>
                <p>Внесите изменения в данные бронирования</p>
            </div>
            <BookingForm
                initial={initial}
                onSubmit={handleUpdate}
                submitLabel="Сохранить изменения"
                clients={clients}
                barbers={barbers}
                procedures={procedures}
                isEditing={true}
            />
        </div>
    );
}