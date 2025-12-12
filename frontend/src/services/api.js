import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
});

// --- JWT Token helpers ---
export function setToken(token) {
    localStorage.setItem("token", token);
}

export function getToken() {
    return localStorage.getItem("token");
}

export function removeToken() {
    localStorage.removeItem("token");
}

export function authHeader() {
    const token = getToken();
    return token ? { Authorization: "Bearer " + token } : {};
}

// --- LOGIN / REGISTER ---
export async function loginUser(payload) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Ошибка авторизации");

    const data = await res.json();

    if (data.token) setToken(data.token); // сохраняем токен в localStorage
    return data;
}

export async function registerUser(payload) {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Ошибка регистрации");
    return res.json();
}

// --- BARBER API ---
export const getBarbers = async () => {
    const res = await api.get("/barber", { headers: authHeader() });
    return res.data;
};

export const getBarberById = async (id) => {
    const res = await api.get(`/barber/${id}`, { headers: authHeader() });
    return res.data;
};

export const createBarber = async (payload) => {
    const res = await api.post("/barber", payload, { headers: authHeader() });
    return res.data;
};

export const updateBarber = async (id, payload) => {
    const res = await api.put(`/barber/${id}`, payload, { headers: authHeader() });
    return res.data;
};

export const deleteBarber = async (id) => {
    const res = await api.delete(`/barber/${id}`, { headers: authHeader() });
    return res.data;
};

// --- CLIENT API ---
export const getClients = async () => {
    const res = await api.get("/clients", { headers: authHeader() });
    return res.data;
};

export const getClientById = async (id) => {
    const res = await api.get(`/clients/${id}`, { headers: authHeader() });
    return res.data;
};

export const createClient = async (payload) => {
    const res = await api.post("/clients", payload, { headers: authHeader() });
    return res.data;
};

export const updateClient = async (id, payload) => {
    const res = await api.put(`/clients/${id}`, payload, { headers: authHeader() });
    return res.data;
};

export const deleteClient = async (id) => {
    const res = await api.delete(`/clients/${id}`, { headers: authHeader() });
    return res.data;
};

export const searchClients = async (keyword) => {
    const res = await api.get("/clients/search", { params: { keyword }, headers: authHeader() });
    return res.data;
};

export const searchByPhone = async (phoneNumber) => {
    const res = await api.get("/clients/search/phone", { params: { phoneNumber }, headers: authHeader() });
    return res.data;
};

// --- USER API ---
export const getUsers = async () => {
    const res = await api.get("/admin", { headers: authHeader() });
    return res.data;
};

export const getUserById = async (id) => {
    const res = await api.get(`/admin/${id}`, { headers: authHeader() });
    return res.data;
};

export const createUser = async (payload) => {
    const res = await api.post("/admin", payload, { headers: authHeader() });
    return res.data;
};

export const updateUser = async (id, payload) => {
    const res = await api.put(`/admin/${id}`, payload, { headers: authHeader() });
    return res.data;
};

export const deleteUser = async (id) => {
    const res = await api.delete(`/admin/${id}`, { headers: authHeader() });
    return res.data;
};

// --- ROLES API ---
export const getRoles = async () => {
    const res = await api.get("/roles", { headers: authHeader() });
    return res.data;
};

// --- BOOKING API ---
export const getBookings = async () => {
    const res = await api.get("/booking", { headers: authHeader() });
    return res.data;
};

export const getBookingById = async (id) => {
    const res = await api.get(`/booking/${id}`, { headers: authHeader() });
    return res.data;
};

export const createBooking = async (payload) => {
    const res = await api.post("/booking", payload, { headers: authHeader() });
    return res.data;
};

export const updateBooking = async (id, payload) => {
    const res = await api.put(`/booking/${id}`, payload, { headers: authHeader() });
    return res.data;
};

export const cancelBooking = async (id) => {
    const res = await api.patch(`/booking/cancel/${id}`, {}, { headers: authHeader() });
    return res.data;
};

export const rescheduleBooking = async (id, newStartTime) => {
    const res = await api.patch(`/booking/reschedule/${id}`, { newStartTime }, { headers: authHeader() });
    return res.data;
};

export const deleteBooking = async (id) => {
    const res = await api.delete(`/booking/${id}`, { headers: authHeader() });
    return res.data;
};

export const searchByBarber = async (barberName) => {
    const res = await api.get("/booking/search/byBarber", { params: { barberName }, headers: authHeader() });
    return res.data;
};

export const searchByClient = async (clientName) => {
    const res = await api.get("/booking/search/byClient", { params: { clientName }, headers: authHeader() });
    return res.data;
};

// --- PROCEDURE API ---
export const getProcedures = async () => {
    const res = await api.get("/procedures", { headers: authHeader() });
    return res.data;
};

export const getProcedureById = async (id) => {
    const res = await api.get(`/procedures/${id}`, { headers: authHeader() });
    return res.data;
};

export const createProcedure = async (payload) => {
    const res = await api.post("/procedures", payload, { headers: authHeader() });
    return res.data;
};

export const updateProcedure = async (id, payload) => {
    const res = await api.put(`/procedures/${id}`, payload, { headers: authHeader() });
    return res.data;
};

export const deleteProcedure = async (id) => {
    const res = await api.delete(`/procedures/${id}`, { headers: authHeader() });
    return res.data;
};

export const findProceduresByCategory = async (category) => {
    const res = await api.get("/procedures/search/category", { params: { category }, headers: authHeader() });
    return res.data;
};

export const findProceduresByActive = async (active) => {
    const res = await api.get("/procedures/search/byActive", { params: { active }, headers: authHeader() });
    return res.data;
};

// --- CATEGORIES API ---
export const getCategories = async () => {
    const res = await api.get("/categories", { headers: authHeader() });
    return res.data;
};

// --- SCHEDULE API ---
export const getSchedules = async () => {
    const res = await api.get("/schedule", { headers: authHeader() });
    return res.data;
};

export const getScheduleById = async (id) => {
    const res = await api.get(`/schedule/${id}`, { headers: authHeader() });
    return res.data;
};

export const createSchedule = async (payload) => {
    const res = await api.post("/schedule", payload, { headers: authHeader() });
    return res.data;
};

export const updateSchedule = async (id, payload) => {
    const res = await api.put(`/schedule/${id}`, payload, { headers: authHeader() });
    return res.data;
};

export const deleteSchedule = async (id) => {
    const res = await api.delete(`/schedule/${id}`, { headers: authHeader() });
    return res.data;
};

export const setScheduleActive = async (id) => {
    const res = await api.patch(`/schedule/${id}`, {}, { headers: authHeader() });
    return res.data;
};

export const getSchedulesByBarber = async (barberId) => {
    const res = await api.get(`/schedule/barber/${barberId}`, { headers: authHeader() });
    return res.data;
};

export const getActiveScheduleByBarber = async (barberId) => {
    const res = await api.get(`/schedule/barber/${barberId}/active`, { headers: authHeader() });
    return res.data;
};

export const isBarberWorking = async (barberId, dayOfWeek) => {
    const res = await api.get(`/schedule/${barberId}/is-working`, { params: { dayOfWeek }, headers: authHeader() });
    return res.data;
};

export const getScheduleForDay = async (barberId, dayOfWeek) => {
    const res = await api.get(`/schedule/${barberId}/day`, { params: { dayOfWeek }, headers: authHeader() });
    return res.data;
};

export default api;