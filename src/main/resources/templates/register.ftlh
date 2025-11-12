<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Регистрация | BarberPro CRM</title>
    <link rel="stylesheet" href="/css/register.css">
</head>
<body>
<div class="register-container">
    <div class="brand-section">
        <div class="logo">
            <svg viewBox="0 0 24 24">
                <path d="M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2M21,9V7L15,5.5V7H9V5.5L3,7V9L9,10.5V12L3,13.5V15.5L9,14V16L3,17.5V19.5L9,18V22H15V18L21,19.5V17.5L15,16V14L21,15.5V13.5L15,12V10.5L21,9Z"/>
            </svg>
        </div>
        <h1>BarberPro CRM</h1>
        <p>Добавление нового пользователя в систему</p>
    </div>

    <div class="register-section">
        <a href="/users" class="back-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            Назад к списку пользователей
        </a>

        <div class="register-header">
            <h2>Регистрация пользователя</h2>
            <p>Заполните данные для создания новой учетной записи</p>
        </div>

        <form id="registerForm" method="post" action="/users/create">
            <div class="form-group">
                <label for="username">Имя пользователя</label>
                <input type="text" id="username" name="username" required placeholder="Введите имя пользователя">
            </div>

            <div class="form-group">
                <label for="password">Пароль</label>
                <div class="password-container">
                    <input type="password" id="password" name="password" required placeholder="Введите пароль">
                    <button type="button" class="toggle-password" id="togglePassword">Показать</button>
                </div>
            </div>

            <div class="form-group">
                <label for="role">Роль</label>
                <select id="role" name="role" required>
                    <option value="">Выберите роль</option>
                    <#list roles as role>
                        <option value="${role.roleName}">${role.roleName}</option>
                    </#list>
                </select>
            </div>

            <button type="submit" class="submit-btn">
                Зарегистрировать
            </button>
        </form>

        <#-- Список существующих пользователей -->
        <#if users?has_content>
            <h3>Существующие пользователи</h3>
            <table class="users-table">
                <thead>
                <tr>
                    <th>Имя пользователя</th>
                    <th>Роль</th>
                </tr>
                </thead>
                <tbody>
                <#list users as user>
                    <tr>
                        <td>${user.username}</td>
                        <td>${user.roles[0].roleName}</td>
                    </tr>
                </#list>
                </tbody>
            </table>
        </#if>
    </div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', function () {
        const togglePassword = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');

        togglePassword.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePassword.textContent = type === 'password' ? 'Показать' : 'Скрыть';
        });
    });
</script>
</body>
</html>
