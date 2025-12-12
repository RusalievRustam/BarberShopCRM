const API_URL = "http://localhost:8080/api/auth";

export async function login(credentials) {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
    });

    if (!response.ok) {
        throw new Error("Неверный логин или пароль");
    }

    return response.json(); // LoginResponse (token, role, username)
}

export async function register(data) {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Ошибка регистрации");
    }

    return response.text();
}