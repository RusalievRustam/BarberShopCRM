import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Barber API (существующие функции)
export const getBarbers = async () => {
    try {
        const res = await api.get("/barber");
        return res.data;
    } catch (e) {
        throw e;
    }
};

export const getBarberById = async (id) => {
    try {
        const res = await api.get(`/barber/${id}`);
        return res.data;
    } catch (e) {
        throw e;
    }
};

export const createBarber = async (payload) => {
    try {
        const res = await api.post(`/barber`, payload);
        return res.data;
    } catch (e) {
        throw e;
    }
};

export const updateBarber = async (id, payload) => {
    try {
        const res = await api.put(`/barber/${id}`, payload);
        return res.data;
    } catch (e) {
        throw e;
    }
};

export const deleteBarber = async (id) => {
    try {
        const res = await api.delete(`/barber/${id}`);
        return res.data;
    } catch (e) {
        throw e;
    }
};

// Client API (новые функции)
export const getClients = async () => {
    try {
        const res = await api.get("/clients");
        return res.data;
    } catch (e) {
        throw e;
    }
};

export const getClientById = async (id) => {
    try {
        const res = await api.get(`/clients/${id}`);
        return res.data;
    } catch (e) {
        throw e;
    }
};

export const createClient = async (payload) => {
    try {
        const res = await api.post("/clients", payload);
        return res.data;
    } catch (e) {
        throw e;
    }
};

export const updateClient = async (id, payload) => {
    try {
        const res = await api.put(`/clients/${id}`, payload);
        return res.data;
    } catch (e) {
        throw e;
    }
};

export const deleteClient = async (id) => {
    try {
        const res = await api.delete(`/clients/${id}`);
        return res.data;
    } catch (e) {
        throw e;
    }
};

export const searchClients = async (keyword) => {
    try {
        const res = await api.get("/clients/search", {
            params: {keyword}
        });
        return res.data;
    } catch (e) {
        throw e;
    }
};

export const searchByPhone = async (phoneNumber) => {
    try {
        const res = await api.get("/clients/search/phone", {
            params: {phoneNumber}
        });
        return res.data;
    } catch (e) {
        throw e;
    }
};
// User API (административная панель)
export const getUsers = async () => {
    try {
        const res = await api.get("/admin");
        return res.data;
    } catch (e) {
        throw e;
    }
};

export const getUserById = async (id) => {
    try {
        const res = await api.get(`/admin/${id}`);
        return res.data;
    } catch (e) {
        throw e;
    }
};

export const createUser = async (payload) => {
    try {
        const res = await api.post("/admin", payload);
        return res.data;
    } catch (e) {
        throw e;
    }
};

export const updateUser = async (id, payload) => {
    try {
        const res = await api.put(`/admin/${id}`, payload);
        return res.data;
    } catch (e) {
        throw e;
    }
};

export const deleteUser = async (id) => {
    try {
        const res = await api.delete(`/admin/${id}`);
        return res.data;
    } catch (e) {
        throw e;
    }
};

// Roles API (нужно создать на бэкенде)
export const getRoles = async () => {
    try {
        const res = await api.get("/roles"); // или другой endpoint
        return res.data;
    } catch (e) {
        console.warn("Не удалось загрузить роли, используем заглушку");
        // Заглушка, если endpoint для ролей не реализован
        return [
            {id: 1, name: "ADMIN"},
            {id: 2, name: "BARBER"},
        ];
    }
};

// Booking API
export const getBookings = async () => {
    try {
        const res = await api.get("/booking");
        return res.data;
    } catch (e) {
        throw e;
    }
};

export const getBookingById = async (id) => {
    try {
        const res = await api.get(`/booking/${id}`);
        return res.data;
    } catch (e) {
        throw e;
    }
};

export const createBooking = async (payload) => {
    try {
        const res = await api.post("/booking", payload);
        return res.data;
    } catch (e) {
        throw e;
    }
};

export const updateBooking = async (id, payload) => {
    try {
        const res = await api.put(`/booking/${id}`, payload);
        return res.data;
    } catch (e) {
        throw e;
    }
};

export const cancelBooking = async (id) => {
    try {
        const res = await api.patch(`/booking/cancel/${id}`);
        return res.data;
    } catch (e) {
        throw e;
    }
};

export const rescheduleBooking = async (id, newStartTime) => {
    try {
        const res = await api.patch(`/booking/reschedule/${id}`, { newStartTime });
        return res.data;
    } catch (e) {
        throw e;
    }
};

export const deleteBooking = async (id) => {
    try {
        const res = await api.delete(`/booking/${id}`);
        return res.data;
    } catch (e) {
        throw e;
    }
};

export const searchByBarber = async (barberName) => {
    try {
        const res = await api.get("/booking/search/byBarber", {
            params: { barberName }
        });
        return res.data;
    } catch (e) {
        throw e;
    }
};

export const searchByClient = async (clientName) => {
    try {
        const res = await api.get("/booking/search/byClient", {
            params: { clientName }
        });
        return res.data;
    } catch (e) {
        throw e;
    }
};

// Procedure API
export const getProcedures = async () => {
    try {
        const res = await api.get("/procedures");
        return res.data;
    } catch (e) {
        throw e;
    }
};

export const getProcedureById = async (id) => {
    try {
        const res = await api.get(`/procedures/${id}`);
        return res.data;
    } catch (e) {
        throw e;
    }
};

export const createProcedure = async (payload) => {
    try {
        const res = await api.post("/procedures", payload);
        return res.data;
    } catch (e) {
        throw e;
    }
};

export const updateProcedure = async (id, payload) => {
    try {
        const res = await api.put(`/procedures/${id}`, payload);
        return res.data;
    } catch (e) {
        throw e;
    }
};

export const deleteProcedure = async (id) => {
    try {
        const res = await api.delete(`/procedures/${id}`);
        return res.data;
    } catch (e) {
        throw e;
    }
};

export const findProceduresByCategory = async (category) => {
    try {
        const res = await api.get("/procedures/search/category", {
            params: { category }
        });
        return res.data;
    } catch (e) {
        throw e;
    }
};

export const findProceduresByActive = async (active) => {
    try {
        const res = await api.get("/procedures/search/byActive", {
            params: { active }
        });
        return res.data;
    } catch (e) {
        throw e;
    }
};

// Categories API
export const getCategories = async () => {
    try {
        const res = await api.get("/categories");
        return res.data
    } catch (e) {
        // Заглушка на случай ошибки
        return [
            { id: 1, categoryName: "Стрижка" },
        ];
    }
};
export default api;