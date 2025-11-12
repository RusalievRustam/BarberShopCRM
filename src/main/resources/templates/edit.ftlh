<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Редактировать пользователя | BarberPro CRM</title>
    <link rel="stylesheet" href="/css/edit_user.css">
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
        <p>Редактирование пользователя</p>
    </div>

    <div class="register-section">
        <a href="/users" class="back-link">Назад к списку пользователей</a>

        <div class="register-header">
            <h2>Редактировать пользователя</h2>
            <p>Измените данные пользователя и сохраните</p>
        </div>

        <form method="post" action="/users/edit/${userId}">
            <div class="form-group">
                <label for="username">Имя пользователя</label>
                <input type="text" id="username" name="username" required value="${userRequest.username!}">
            </div>

            <div class="form-group">
                <label for="password">Пароль (оставьте пустым, чтобы не менять)</label>
                <div class="password-container">
                    <input type="password" id="password" name="password" placeholder="Введите новый пароль">
                    <button type="button" class="toggle-password" id="togglePassword">Показать</button>
                </div>
            </div>

            <div class="form-group">
                <label for="role">Роль</label>
                <select id="role" name="role" required>
                    <option value="">Выберите роль</option>
                    <#list roles as role>
                        <option value="${role.roleName}" <#if role.roleName == userRequest.role>selected</#if>>${role.roleName}</option>
                    </#list>
                </select>
            </div>

            <button type="submit" class="submit-btn">Сохранить</button>
        </form>
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