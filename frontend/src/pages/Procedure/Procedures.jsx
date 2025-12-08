import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    getProcedures,
    deleteProcedure,
    findProceduresByCategory,
    findProceduresByActive,
    getCategories
} from "../../services/api";
import "./Procedures.css";

export default function Procedures() {
    const [procedures, setProcedures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [searchCategory, setSearchCategory] = useState("");
    const [filterActive, setFilterActive] = useState("ALL");
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        inactive: 0,
        totalRevenue: 0
    });

    const loadProcedures = async () => {
        setLoading(true);
        setError(null);
        try {
            const [proceduresData, categoriesData] = await Promise.all([
                getProcedures(),
                getCategories()
            ]);
            setProcedures(proceduresData);
            setCategories(categoriesData || []);
            calculateStats(proceduresData);
        } catch (e) {
            setError(e.message || "Ошибка загрузки услуг");
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (proceduresData) => {
        const total = proceduresData.length;
        const active = proceduresData.filter(p => p.active).length;
        const inactive = total - active;
        const totalRevenue = proceduresData.reduce((sum, p) => sum + (p.price || 0), 0);

        setStats({
            total,
            active,
            inactive,
            totalRevenue: Math.round(totalRevenue)
        });
    };

    useEffect(() => {
        loadProcedures();
    }, []);

    const handleDelete = async (id, name) => {
        if (!confirm(`Удалить услугу "${name}"?`)) return;
        try {
            await deleteProcedure(id);
            setProcedures(procedures.filter(p => p.id !== id));
        } catch (e) {
            alert("Ошибка при удалении: " + (e.message || e.status));
        }
    };

    const handleCategorySearch = async () => {
        if (!searchCategory.trim()) {
            loadProcedures();
            return;
        }
        setLoading(true);
        try {
            const data = await findProceduresByCategory(searchCategory);
            setProcedures(data);
        } catch (e) {
            setError("Ошибка поиска: " + (e.message || e.status));
        } finally {
            setLoading(false);
        }
    };

    const handleActiveFilter = async (active) => {
        setLoading(true);
        try {
            const data = await findProceduresByActive(active);
            setProcedures(data);
        } catch (e) {
            setError("Ошибка фильтрации: " + (e.message || e.status));
        } finally {
            setLoading(false);
        }
    };

    const handleClearFilters = () => {
        setSearchCategory("");
        setFilterActive("ALL");
        loadProcedures();
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'SOM',
            minimumFractionDigits: 0
        }).format(price);
    };

    const getCategoryBadge = (categoryData) => {
        // categoryData может быть объектом или строкой
        let categoryName;

        if (typeof categoryData === 'string') {
            categoryName = categoryData;
        } else if (categoryData && typeof categoryData === 'object') {
            // Если это объект, берем categoryName или другое поле
            categoryName = categoryData.categoryName || categoryData.name || categoryData.category || 'Без категории';
        } else {
            categoryName = 'Без категории';
        }

        const categoryColors = {
            'СТРИЖКА': { bg: 'rgba(59, 130, 246, 0.1)', color: '#2563eb', border: 'rgba(59, 130, 246, 0.2)' },
            'БОРОДА': { bg: 'rgba(245, 158, 11, 0.1)', color: '#b45309', border: 'rgba(245, 158, 11, 0.2)' },
            'УХОД': { bg: 'rgba(16, 185, 129, 0.1)', color: '#047857', border: 'rgba(16, 185, 129, 0.2)' },
            'КОМПЛЕКС': { bg: 'rgba(139, 92, 246, 0.1)', color: '#6d28d9', border: 'rgba(139, 92, 246, 0.2)' }
        };

        const upperName = categoryName.toUpperCase();
        const config = categoryColors[upperName] ||
            { bg: 'rgba(100, 116, 139, 0.1)', color: '#475569', border: 'rgba(100, 116, 139, 0.2)' };

        return (
            <span
                className="category-badge"
                style={{
                    background: config.bg,
                    color: config.color,
                    border: `1px solid ${config.border}`
                }}
            >
            {categoryName}
        </span>
        );
    };
    const getStatusBadge = (active) => active
        ? <span className="status-badge status-active">Активна</span>
        : <span className="status-badge status-inactive">Неактивна</span>;

    const filteredProcedures = procedures.filter(procedure => {
        if (filterActive === "ACTIVE") return procedure.active;
        if (filterActive === "INACTIVE") return !procedure.active;
        return true;
    });

    if (loading) return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Загрузка услуг...</p>
        </div>
    );

    if (error) return (
        <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h3>Ошибка при загрузке</h3>
            <p>{error}</p>
            <button onClick={loadProcedures} className="retry-btn">Попробовать снова</button>
        </div>
    );

    return (
        <div className="procedures-container">
            <div className="page-header">
                <h1>Услуги барбершопа</h1>
                <p>Управление прайс-листом и услугами</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">💇</div>
                    <div className="stat-content">
                        <span className="stat-number">{stats.total}</span>
                        <span className="stat-label">Всего услуг</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                        <span className="stat-number">{stats.active}</span>
                        <span className="stat-label">Активных</span>
                    </div>
                </div>
            </div>

            <div className="controls-bar">
                <div className="filters-section">
                    <div className="filters-grid">
                        <div className="filter-group">
                            <label>Поиск по категории</label>
                            <div className="category-search">
                                <select
                                    value={searchCategory}
                                    onChange={(e) => setSearchCategory(e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="">Все категории</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.categoryName}>
                                            {cat.categoryName}
                                        </option>
                                    ))}
                                </select>
                                <button onClick={handleCategorySearch} className="filter-btn">
                                    Найти
                                </button>
                            </div>
                        </div>

                        <div className="filter-group">
                            <label>Фильтр по статусу</label>
                            <select
                                value={filterActive}
                                onChange={(e) => {
                                    setFilterActive(e.target.value);
                                    if (e.target.value !== "ALL") {
                                        handleActiveFilter(e.target.value === "ACTIVE");
                                    } else {
                                        loadProcedures();
                                    }
                                }}
                                className="filter-select"
                            >
                                <option value="ALL">Все статусы</option>
                                <option value="ACTIVE">Только активные</option>
                                <option value="INACTIVE">Только неактивные</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>&nbsp;</label>
                            <button onClick={handleClearFilters} className="clear-filters-btn">
                                Сбросить фильтры
                            </button>
                        </div>
                    </div>
                </div>

                <Link to="/procedures/create" className="add-btn">
                    <span className="btn-icon">+</span>
                    Добавить услугу
                </Link>
            </div>

            {filteredProcedures.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">✂️</div>
                    <h3>Услуги не найдены</h3>
                    <p>{searchCategory || filterActive !== "ALL" ? "Попробуйте изменить фильтры" : "Добавьте первую услугу в прайс-лист"}</p>
                    {!searchCategory && filterActive === "ALL" && (
                        <Link to="/procedures/create" className="empty-btn">
                            Добавить услугу
                        </Link>
                    )}
                </div>
            ) : (
                <div className="table-container">
                    <table className="procedures-table">
                        <thead>
                        <tr>
                            <th>Услуга</th>
                            <th>Категория</th>
                            <th>Цена</th>
                            <th>Длительность</th>
                            <th>Статус</th>
                            <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredProcedures.map(procedure => (
                            <tr key={procedure.id}
                                className={procedure.active ? "procedure-active" : "procedure-inactive"}>
                                <td>
                                    <div className="procedure-info">
                                        <Link to={`/procedures/${procedure.id}`} className="procedure-link">
                                            {procedure.procedureName}
                                        </Link>
                                    </div>
                                </td>
                                <td>
                                    {getCategoryBadge(procedure.category)}
                                </td>
                                <td>
                                    <div className="price-cell">
                                        {formatPrice(procedure.price)}
                                    </div>
                                </td>
                                <td>
                                    <div className="duration-cell">
                                        <span className="duration-value">{procedure.duration}</span>
                                        <span className="duration-unit"> мин</span>
                                    </div>
                                </td>
                                <td>
                                    {getStatusBadge(procedure.active)}
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <Link
                                            to={`/procedures/${procedure.id}`}
                                            className="view-btn"
                                            title="Просмотреть детали"
                                        >
                                            📝
                                        </Link>
                                        <Link
                                            to={`/procedures/${procedure.id}/edit`}
                                            className="edit-btn"
                                        >
                                            Редактировать
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(procedure.id, procedure.name)}
                                            className="delete-btn"
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div className="table-footer">
                        <span className="procedures-count">
                            Показано услуг: {filteredProcedures.length} из {procedures.length}
                        </span>

                    </div>
                </div>
            )}
        </div>
    );
}