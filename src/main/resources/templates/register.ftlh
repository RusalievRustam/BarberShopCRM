<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Регистрация | BarberPro CRM</title>
    <style>
        :root {
            --primary: #1a1a1a;
            --accent: #d4af37;
            --light: #f5f5f5;
            --gray: #8a8a8a;
            --error: #e74c3c;
            --success: #27ae60;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
            background-color: #f9f9f9;
            color: var(--primary);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%231a1a1a"/><path d="M30,30 L70,30 L70,70 L30,70 Z" fill="none" stroke="%23d4af37" stroke-width="2"/><path d="M40,40 L60,40 L60,60 L40,60 Z" fill="none" stroke="%23d4af37" stroke-width="1"/></svg>');
            background-size: cover;
            padding: 20px;
        }

        .register-container {
            display: flex;
            width: 1000px;
            max-width: 100%;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .brand-section {
            flex: 1;
            background: var(--primary);
            color: white;
            padding: 40px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .brand-section::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, transparent 0%, rgba(212, 175, 55, 0.1) 100%);
        }

        .logo {
            width: 80px;
            height: 80px;
            background: var(--accent);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
            position: relative;
            z-index: 1;
        }

        .logo svg {
            width: 50px;
            height: 50px;
            fill: var(--primary);
        }

        .brand-section h1 {
            font-size: 28px;
            margin-bottom: 10px;
            position: relative;
            z-index: 1;
        }

        .brand-section p {
            color: var(--gray);
            font-size: 16px;
            line-height: 1.5;
            max-width: 300px;
            position: relative;
            z-index: 1;
        }

        .register-section {
            flex: 1;
            padding: 50px 40px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .register-header {
            margin-bottom: 30px;
        }

        .register-header h2 {
            font-size: 28px;
            margin-bottom: 10px;
            color: var(--primary);
        }

        .register-header p {
            color: var(--gray);
            font-size: 16px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: var(--primary);
        }

        input, select {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
            transition: all 0.3s;
        }

        input:focus, select:focus {
            outline: none;
            border-color: var(--accent);
            box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2);
        }

        .password-container {
            position: relative;
        }

        .toggle-password {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: var(--gray);
            cursor: pointer;
        }

        .submit-btn {
            background: var(--primary);
            color: white;
            border: none;
            padding: 14px;
            border-radius: 5px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            margin-top: 10px;
        }

        .submit-btn:hover {
            background: #000;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .submit-btn:active {
            transform: translateY(0);
        }

        .submit-btn svg {
            margin-right: 10px;
        }

        .back-link {
            display: inline-flex;
            align-items: center;
            color: var(--accent);
            text-decoration: none;
            font-weight: 500;
            margin-bottom: 20px;
        }

        .back-link:hover {
            text-decoration: underline;
        }

        .back-link svg {
            margin-right: 8px;
        }

        .message {
            padding: 12px 16px;
            border-radius: 5px;
            margin-top: 20px;
            font-weight: 500;
            display: none;
        }

        .message.success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
            display: block;
        }

        .message.error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
            display: block;
        }

        @media (max-width: 768px) {
            .register-container {
                flex-direction: column;
            }

            .brand-section {
                padding: 30px 20px;
            }

            .register-section {
                padding: 30px 20px;
            }
        }
    </style>

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
