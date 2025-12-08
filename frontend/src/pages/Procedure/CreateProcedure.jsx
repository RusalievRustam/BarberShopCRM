import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProcedureForm from "../../components/Procedure/ProcedureForm";
import { createProcedure, getCategories } from "../../services/api";
import "../PageLayout.css";

export default function CreateProcedure() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data || []);
        } catch (e) {
            console.error("Ошибка загрузки категорий:", e);
            setError("Не удалось загрузить список категорий");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (payload) => {
        try {
            await createProcedure(payload);
            alert("Услуга успешно создана!");
            navigate("/procedures");
        } catch (e) {
            alert("Ошибка при создании услуги: " + (e.message || e.status));
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
                <h1>Создать услугу</h1>
                <p>Добавьте новую услугу в прайс-лист</p>
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

            <ProcedureForm
                onSubmit={handleCreate}
                submitLabel="Создать услугу"
                categories={categories}
            />
        </div>
    );
}