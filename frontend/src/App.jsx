import React from "react";
import { Routes, Route, NavLink, Navigate } from "react-router-dom";

import BarberList from "./pages/Barber/BarberList";
import CreateBarber from "./pages/Barber/CreateBarber";
import EditBarber from "./pages/Barber/EditBarber";

import Clients from "./pages/Client/Clients";
import CreateClient from "./pages/Client/CreateClient";
import EditClient from "./pages/Client/EditClient";

import Users from "./pages/User/Users";
import CreateUser from "./pages/User/CreateUser";
import EditUser from "./pages/User/EditUser";

import Bookings from "./pages/Booking/Bookings";
import CreateBooking from "./pages/Booking/CreateBooking";
import EditBooking from "./pages/Booking/EditBooking";

import Procedures from "./pages/Procedure/Procedures";
import CreateProcedure from "./pages/Procedure/CreateProcedure";
import EditProcedure from "./pages/Procedure/EditProcedure";
import ProcedureDetails from "./pages/Procedure/ProcedureDetails";

import Schedules from "./pages/Schedule/Schedules";
import CreateSchedule from "./pages/Schedule/CreateSchedule";
import EditSchedule from "./pages/Schedule/EditSchedule";
import BarberSchedule from "./pages/Barber/BarberSchedule";

import Login from "./pages/Authorization/Login";
import Register from "./pages/Authorization/Register";

import PrivateRoute from "../src/router/PrivateRote.jsx";

import "./App.css";

export default function App() {
    const token = localStorage.getItem("token");

    return (
        <div className="app">
            {/* Показываем меню только если пользователь авторизован */}
            {token && (
                <header className="header">
                    <div className="header-container">
                        <div className="logo">
                            <span className="logo-icon">💈</span>
                            <span>BarberShop Pro</span>
                        </div>
                        <nav className="nav">
                            <NavLink to="/barbers" className="nav-link">Барберы</NavLink>
                            <NavLink to="/clients" className="nav-link">Клиенты</NavLink>
                            <NavLink to="/procedures" className="nav-link">Услуги</NavLink>
                            <NavLink to="/bookings" className="nav-link">Записи</NavLink>
                            <NavLink to="/admin/users" className="nav-link">Пользователи</NavLink>
                        </nav>
                    </div>
                </header>
            )}

            <main className="main">
                <Routes>

                    {/* --- Публичные пути --- */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Если не авторизован → на логин */}
                    <Route path="/" element={<Navigate to="/bookings" replace />} />

                    {/* --- Защищённые маршруты --- */}
                    <Route
                        path="/barbers"
                        element={<PrivateRoute><BarberList /></PrivateRoute>}
                    />
                    <Route
                        path="/barbers/create"
                        element={<PrivateRoute><CreateBarber /></PrivateRoute>}
                    />
                    <Route
                        path="/barbers/:id/edit"
                        element={<PrivateRoute><EditBarber /></PrivateRoute>}
                    />

                    <Route
                        path="/clients"
                        element={<PrivateRoute><Clients /></PrivateRoute>}
                    />
                    <Route
                        path="/clients/create"
                        element={<PrivateRoute><CreateClient /></PrivateRoute>}
                    />
                    <Route
                        path="/clients/:id/edit"
                        element={<PrivateRoute><EditClient /></PrivateRoute>}
                    />

                    <Route
                        path="/procedures"
                        element={<PrivateRoute><Procedures /></PrivateRoute>}
                    />
                    <Route
                        path="/procedures/create"
                        element={<PrivateRoute><CreateProcedure /></PrivateRoute>}
                    />
                    <Route
                        path="/procedures/:id/edit"
                        element={<PrivateRoute><EditProcedure /></PrivateRoute>}
                    />
                    <Route
                        path="/procedures/:id"
                        element={<PrivateRoute><ProcedureDetails /></PrivateRoute>}
                    />

                    <Route
                        path="/bookings"
                        element={<PrivateRoute><Bookings /></PrivateRoute>}
                    />
                    <Route
                        path="/bookings/create"
                        element={<PrivateRoute><CreateBooking /></PrivateRoute>}
                    />
                    <Route
                        path="/bookings/:id/edit"
                        element={<PrivateRoute><EditBooking /></PrivateRoute>}
                    />

                    <Route
                        path="/admin/users"
                        element={<PrivateRoute><Users /></PrivateRoute>}
                    />
                    <Route
                        path="/admin/users/create"
                        element={<PrivateRoute><CreateUser /></PrivateRoute>}
                    />
                    <Route
                        path="/admin/users/:id/edit"
                        element={<PrivateRoute><EditUser /></PrivateRoute>}
                    />

                    <Route
                        path="/schedules"
                        element={<PrivateRoute><Schedules /></PrivateRoute>}
                    />
                    <Route
                        path="/schedules/create"
                        element={<PrivateRoute><CreateSchedule /></PrivateRoute>}
                    />
                    <Route
                        path="/schedules/:id/edit"
                        element={<PrivateRoute><EditSchedule /></PrivateRoute>}
                    />

                    <Route
                        path="/barbers/:id/schedule"
                        element={<PrivateRoute><BarberSchedule /></PrivateRoute>}
                    />

                </Routes>
            </main>
        </div>
    );
}