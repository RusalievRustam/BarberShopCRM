import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
});

// --- JWT Token helpers ---
export function setToken(token) {
    if (!token) return;
    const t = String(token).trim();
    localStorage.setItem("token", t);
}

export function getToken() {
    const raw = localStorage.getItem("token");
    if (!raw) return null;
    const t = String(raw).trim();
    return t.startsWith("Bearer ") ? t.slice("Bearer ".length).trim() : t;
}

function base64UrlToBase64(input) {
    const base64 = String(input).replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    if (pad === 0) return base64;
    return base64 + "=".repeat(4 - pad);
}

function decodeBase64Utf8(base64) {
    const binary = atob(base64);
    // Совместимость: TextDecoder есть не везде (например, старые браузеры)
    if (typeof TextDecoder !== "undefined") {
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        return new TextDecoder("utf-8").decode(bytes);
    }
    // Fallback через percent-encoding
    return decodeURIComponent(
        binary
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
    );
}

function parseJwt(token) {
    try {
        const payloadPart = token.split(".")[1];
        if (!payloadPart) return null;
        const base64 = base64UrlToBase64(payloadPart);
        const json = decodeBase64Utf8(base64);
        return JSON.parse(json);
    } catch {
        return null;
    }
}

export function getRoleFromToken() {
    const token = getToken();
    if (!token) return null;
    const payload = parseJwt(token);
    return payload?.role || payload?.roles || payload?.authorities || null;
}

function normalizeRoles(raw) {
    if (!raw) return [];

    // array: ["ROLE_ADMIN"] | [{authority:"ROLE_ADMIN"}]
    if (Array.isArray(raw)) {
        return raw
            .map((x) => {
                if (typeof x === "string") return x;
                if (x && typeof x === "object") return x.authority || x.role || x.name || null;
                return null;
            })
            .filter(Boolean)
            .map((s) => String(s));
    }

    // object: {authority:"ROLE_ADMIN"} etc.
    if (raw && typeof raw === "object") {
        const v = raw.authority || raw.role || raw.name;
        return v ? [String(v)] : [];
    }

    // string: "ROLE_ADMIN" or "ROLE_ADMIN,ROLE_USER"
    const str = String(raw);
    return str
        .split(/[,\s]+/)
        .map((s) => s.trim())
        .filter(Boolean);
}

export function isAdmin() {
    const raw = getRoleFromToken();
    const roles = normalizeRoles(raw);
    if (roles.length === 0) return false;
    return roles.some((r) => r === "ROLE_ADMIN" || r === "ADMIN" || r.includes("ROLE_ADMIN") || r.includes("ADMIN"));
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
    return res.text();
}

// --- BARBER API ---
export const getBarbers = async () => {
    const res = await api.get("/barbers", { headers: authHeader() });
    return res.data;
};

export const getBarberById = async (id) => {
    const res = await api.get(`/barbers/${id}`, { headers: authHeader() });
    return res.data;
};

export const createBarber = async (payload) => {
    const res = await api.post("/barbers", payload, { headers: authHeader() });
    return res.data;
};

export const updateBarber = async (id, payload) => {
    const res = await api.put(`/barbers/${id}`, payload, { headers: authHeader() });
    return res.data;
};

export const deleteBarber = async (id) => {
    const res = await api.delete(`/barbers/${id}`, { headers: authHeader() });
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

// --- ADMIN FINANCE API ---
export const adminCreatePayment = async (bookingId, method) => {
    const res = await api.post(
        "/admin/finance/payments",
        { bookingId, method },
        { headers: authHeader() }
    );
    return res.data;
};

export const adminGetRevenue = async (startDate, endDate) => {
    const res = await api.get("/admin/finance/revenue", {
        params: { startDate, endDate },
        headers: authHeader()
    });
    return res.data;
};

export const adminGetPayments = async (startDate, endDate) => {
    const res = await api.get("/admin/finance/payments", {
        params: { startDate, endDate },
        headers: authHeader()
    });
    return res.data;
};

export const adminGetRevenueByBarber = async (startDate, endDate) => {
    const res = await api.get("/admin/finance/revenue-by-barber", {
        params: { startDate, endDate },
        headers: authHeader()
    });
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
    try {
        const res = await api.get("/categories", { headers: authHeader() });
        return res.data
    } catch (e) {
        // Заглушка на случай ошибки
        return [
            { id: 1, categoryName: "Стрижка" },
        ];
    }
};

// --- WORK SCHEDULE API (/api/schedule) ---
export const getSchedulesByBarber = async (barberId) => {
    const res = await api.get(`/schedule/barber/${barberId}`, { headers: authHeader() });
    return res.data;
};

export const createSchedule = async (payload) => {
    const res = await api.post("/schedule", payload, { headers: authHeader() });
    return res.data;
};

export const deleteSchedule = async (id) => {
    const res = await api.delete(`/schedule/${id}`, { headers: authHeader() });
    return res.data;
};

export const getSchedules = async () => {
    const res = await api.get("/schedule", { headers: authHeader() });
    return res.data;
};

export const getScheduleById = async (id) => {
    const res = await api.get(`/schedule/${id}`, { headers: authHeader() });
    return res.data;
};

export const updateSchedule = async (id, payload) => {
    const res = await api.put(`/schedule/${id}`, payload, { headers: authHeader() });
    return res.data;
};

export const setScheduleActive = async (scheduleId) => {
    const res = await api.patch(`/schedule/${scheduleId}`, null, { headers: authHeader() });
    return res.data;
};

// Add these new functions to api.js, before the export default api;

const toLocalYyyyMmDd = (date) => {
    if (!date) return "";
    if (typeof date === "string") return date.slice(0, 10);
    const d = new Date(date);
    const yyyy = String(d.getFullYear());
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
};

// Barber Availability API
export const getBarberAvailability = async (barberId, date) => {
    try {
        const dateParam = encodeURIComponent(toLocalYyyyMmDd(date));
        const res = await api.get(
            `/barbers/${barberId}/availability?date=${dateParam}`,
            { headers: authHeader() }
        );
        return res.data;
    } catch (e) {
        throw e;
    }
};

export const setBarberAvailability = async (barberId, availability) => {
    try {
        const res = await api.post(`/barbers/${barberId}/availability`, availability, { headers: authHeader() });
        return res.data;
    } catch (e) {
        throw e;
    }
};

export const getAvailableTimeSlots = async (barberId, date, durationMinutes = 60) => {
    try {
        const dateParam = encodeURIComponent(toLocalYyyyMmDd(date));
        const res = await api.get(
            `/barbers/${barberId}/available-slots?date=${dateParam}&durationMinutes=${durationMinutes}`,
            { headers: authHeader() }
        );
        return res.data;
    } catch (e) {
        throw e;
    }
};

export const getBarberWeeklySchedule = async (barberId) => {
    try {
        const res = await api.get(`/barbers/${barberId}/schedule`, { headers: authHeader() });
        return res.data;
    } catch (e) {
        throw e;
    }
};

export default api;