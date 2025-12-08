import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BookingForm from "../../components/Booking/BookingForm";
import { createBooking, getClients, getBarbers, getProcedures } from "../../services/api";
import "../PageLayout.css";

export default function CreateBooking() {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [barbers, setBarbers] = useState([]);
    const [procedures, setProcedures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [clientsData, barbersData, proceduresData] = await Promise.all([
                getClients(),
                getBarbers(),
                getProcedures()
            ]);

            setClients(clientsData || []);
            setBarbers(barbersData || []);
            setProcedures(proceduresData || []);
        } catch (e) {
            console.error("Ошибка загрузки данных:", e);
            setError("Не удалось загрузить необходимые данные");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (payload) => {
        try {
            await createBooking(payload);
            alert("Запись успешно создана!");
            navigate("/bookings");
        } catch (e) {
            alert("Ошибка при создании записи: " + (e.message || e.status));
        }
    };

    if (loading) return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Загрузка данных...</p>
        </div>
    );

    return (
        <div className="page-layout">
            <div className="page-header">
                <h1>Новая запись</h1>
                <p>Забронируйте время для стрижки</p>
            </div>

            {error && (
                <div className="error-message" style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: '#dc2626',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1.5rem',
                    border: '1px solid rgba(239, 68, 68, 0.2)'
                }}>
                    <strong>Ошибка:</strong> {error}
                </div>
            )}

            <BookingForm
                onSubmit={handleCreate}
                submitLabel="Создать запись"
                clients={clients}
                barbers={barbers}
                procedures={procedures}
                isEditing={false}
            />
        </div>
    );
}