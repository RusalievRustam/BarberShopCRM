import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProcedureForm from "../../components/Procedure/ProcedureForm";
import {
    getProcedureById,
    updateProcedure,
    getCategories
} from "../../services/api";
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
        setLoading(true);
        setError(null);
        try {
            const [procedureData, categoriesData] = await Promise.all([
                getProcedureById(id),
                getCategories()
            ]);

            if (!procedureData) {
                throw new Error("Услуга не найдена");
            }

            // Нормализация данных, передаём только то, что понимает форма
            const normalizedProcedure = {
                id: procedureData.id,
                procedureName: procedureData.procedureName || procedureData.name || "",
                description: procedureData.description || "",
                price: procedureData.price || 0,
                duration: procedureData.duration || 0,
                categoryId: procedureData.categoryId ||
                    procedureData.category?.id ||
                    procedureData.categoryId ||
                    "",
                active: procedureData.active !== undefined ? procedureData.active : true
            };

            setInitial(normalizedProcedure);
            setCategories(categoriesData || []);
        } catch (e) {
            setError("Не удалось загрузить услугу: " + (e.message || e.status));
            console.error("Ошибка загрузки:", e);
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

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Загрузка данных...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-icon">❌</div>
                <h3>Ошибка загрузки</h3>
                <p>{error}</p>
                <button onClick={() => navigate("/procedures")} className="retry-btn">
                    Вернуться назад
                </button>
            </div>
        );
    }

    // Ожидаем, пока initial не будет установлен
    if (!initial) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Подготовка формы...</p>
            </div>
        );
    }

    return (
        <div className="page-layout">
            <div className="page-header">
                <h1>Редактировать услугу</h1>
                <p>Измените необходимые данные</p>
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