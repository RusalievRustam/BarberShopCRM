import React from "react";
import { useNavigate } from "react-router-dom";
import BarberForm from "../../components/Barber/BarberForm.jsx";
import { createBarber } from "../../services/api.js";
import "../PageLayout.css";

export default function CreateBarber() {
    const navigate = useNavigate();

    const handleCreate = async (payload) => {
        try {
            await createBarber(payload);
            alert("Барбер успешно создан!");
            navigate("/barbers");
        } catch (e) {
            alert("Ошибка при создании: " + (e.message || e.status));
        }
    };

    return (
        <div className="page-layout">
            <div className="page-header">
                <h1>Добавить барбера</h1>
                <p>Заполните информацию о новом барбере</p>
            </div>
            <BarberForm onSubmit={handleCreate} submitLabel="Создать барбера" />
        </div>
    );
}