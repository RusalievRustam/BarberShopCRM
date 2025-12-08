import React from "react";
import { useNavigate } from "react-router-dom";
import ClientForm from "../../components/Client/ClientForm.jsx";
import { createClient } from "../../services/api";
import "../PageLayout.css";

export default function CreateClient() {
    const navigate = useNavigate();

    const handleCreate = async (payload) => {
        try {
            await createClient(payload);
            alert("Клиент успешно создан!");
            navigate("/clients");
        } catch (e) {
            alert("Ошибка при создании: " + (e.message || e.status));
        }
    };

    return (
        <div className="page-layout">
            <div className="page-header">
                <h1>Добавить клиента</h1>
                <p>Заполните информацию о новом клиенте</p>
            </div>
            <ClientForm onSubmit={handleCreate} submitLabel="Создать клиента" />
        </div>
    );
}