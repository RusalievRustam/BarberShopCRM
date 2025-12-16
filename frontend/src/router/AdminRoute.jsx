import { Navigate } from "react-router-dom";
import { isAdmin } from "../services/api";

export default function AdminRoute({ children }) {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin()) {
        return <Navigate to="/bookings" replace />;
    }

    return children;
}
