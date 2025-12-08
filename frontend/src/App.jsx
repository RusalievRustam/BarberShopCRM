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
import "./App.css";
import ProcedureDetails from "./pages/Procedure/ProcedureDetails.jsx";

export default function App() {
    return (
        <div className="app">
            <header className="header">
                <div className="header-container">
                    <div className="logo">
                        <span className="logo-icon">💈</span>
                        <span>BarberShop Pro</span>
                    </div>
                    <nav className="nav">
                        <NavLink to="/barbers" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                            Барберы
                        </NavLink>
                        <NavLink to="/clients" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                            Клиенты
                        </NavLink>
                        <NavLink to="/procedures" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                            Услуги
                        </NavLink>
                        <NavLink to="/bookings" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                            Записи
                        </NavLink>
                        <NavLink to="/admin/users" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                            Пользователи
                        </NavLink>
                    </nav>
                </div>
            </header>

            <main className="main">
                <Routes>
                    <Route path="/" element={<Navigate to="/bookings" replace />} />
                    <Route path="/barbers" element={<BarberList />} />
                    <Route path="/barbers/create" element={<CreateBarber />} />
                    <Route path="/barbers/:id/edit" element={<EditBarber />} />
                    <Route path="/clients" element={<Clients />} />
                    <Route path="/clients/create" element={<CreateClient />} />
                    <Route path="/clients/:id/edit" element={<EditClient />} />
                    <Route path="/procedures" element={<Procedures />} />
                    <Route path="/procedures/create" element={<CreateProcedure />} />
                    <Route path="/procedures/:id/edit" element={<EditProcedure />} />
                    <Route path="/procedures/:id" element={<ProcedureDetails />} />
                    <Route path="/bookings" element={<Bookings />} />
                    <Route path="/bookings/create" element={<CreateBooking />} />
                    <Route path="/bookings/:id/edit" element={<EditBooking />} />
                    <Route path="/admin/users" element={<Users />} />
                    <Route path="/admin/users/create" element={<CreateUser />} />
                    <Route path="/admin/users/:id/edit" element={<EditUser />} />
                </Routes>
            </main>
        </div>
    );
}