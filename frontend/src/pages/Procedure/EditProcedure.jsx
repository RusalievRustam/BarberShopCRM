import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProcedureForm from "../../components/Procedure/ProcedureForm";
import { getProcedureById, updateProcedure, getCategories } from "../../services/api";
import "../PageLayout.css";

export default function EditProcedure() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [initial, setInitial] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const [procedureData, categoriesData] = await Promise.all([
                getProcedureById(id),
                getCategories()
            ]);

            setInitial(procedureData);
            setCategories(categoriesData || []);
        } catch (e) {
            setError("Не удалось загрузить данные услуги: " + (e.message || e.status));
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (payload) => {
        try {
            await updateProcedure(id, payload);
            alert("Изменения сохранены!");
            navigate("/procedures");
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
            <button onClick={() => navigate("/procedures")} className="retry-btn">
                Вернуться к списку
            </button>
        </div>
    );

    if (!initial) return (
        <div className="error-container">
            <div className="error-icon">✂️</div>
            <h3>Услуга не найдена</h3>
            <p>Запрошенная услуга не существует или была удалена</p>
            <button onClick={() => navigate("/procedures")} className="retry-btn">
                Вернуться к списку
            </button>
        </div>
    );

    return (
        <div className="page-layout">
            <div className="page-header">
                <h1>Редактировать услугу</h1>
                <p>Внесите изменения в данные услуги</p>
            </div>
            <ProcedureForm
                initial={initial}
                onSubmit={handleUpdate}
                submitLabel="Сохранить изменения"
                categories={categories}
            />
        </div>
    );
}