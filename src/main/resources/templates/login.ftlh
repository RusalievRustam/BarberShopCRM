<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Вход в CRM | Барбершоп</title>
    <link rel="stylesheet" href="/css/login.css">
</head>
<body>
<div class="login-container">
    <div class="brand-section">
        <div class="logo">
            <svg viewBox="0 0 24 24">
                <path d="M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2M21,9V7L15,5.5V7H9V5.5L3,7V9L9,10.5V12L3,13.5V15.5L9,14V16L3,17.5V19.5L9,18V22H15V18L21,19.5V17.5L15,16V14L21,15.5V13.5L15,12V10.5L21,9Z"/>
            </svg>
        </div>
        <h1>BarberPro CRM</h1>
        <p>Профессиональная система управления для вашего барбершопа</p>
    </div>

    <div class="login-section">
        <div class="login-header">
            <h2>Вход в систему</h2>
            <p>Введите свои учетные данные для доступа к CRM</p>
        </div>

        <form method="post" action="/users/login" id="loginForm">
            <div class="form-group">
                <label for="username">Имя пользователя</label>
                <input type="text" id="username" name="username" required placeholder="Введите имя пользователя">
                <div class="error-message" id="usernameError">Пожалуйста, введите имя пользователя</div>
            </div>

            <div class="form-group">
                <label for="password">Пароль</label>
                <div class="password-container">
                    <input type="password" id="password" name="password" required placeholder="Введите пароль">
                    <button type="button" class="toggle-password" id="togglePassword">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 9C10.343 9 9 10.343 9 12C9 13.657 10.343 15 12 15C13.657 15 15 13.657 15 12C15 10.343 13.657 9 12 9Z"
                                  fill="currentColor"/>
                            <path d="M12 5C7 5 2.73 8.11 1 12.5C2.73 16.89 7 20 12 20C17 20 21.27 16.89 23 12.5C21.27 8.11 17 5 12 5ZM12 17.5C9.24 17.5 7 15.26 7 12.5C7 9.74 9.24 7.5 12 7.5C14.76 7.5 17 9.74 17 12.5C17 15.26 14.76 17.5 12 17.5Z"
                                  fill="currentColor"/>
                        </svg>
                    </button>
                </div>
                <div class="error-message" id="passwordError">Пожалуйста, введите пароль</div>
            </div>

            <div class="remember-forgot">
                <div class="remember-me">
                    <input type="checkbox" id="remember" name="remember">
                    <label for="remember">Запомнить меня</label>
                </div>
                <a href="#" class="forgot-password">Забыли пароль?</a>
            </div>

            <button type="submit" class="submit-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 17L15 12L10 7V17ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                          fill="white"/>
                </svg>
                Войти
            </button>
        </form>
    </div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', function () {
        const togglePassword = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');
        const loginForm = document.getElementById('loginForm');


        // Toggle password visibility
        togglePassword.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            // Change icon
            if (type === 'text') {
                togglePassword.innerHTML = `
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 7C14.76 7 17 9.24 17 12C17 12.65 16.87 13.26 16.64 13.83L19.56 16.75C21.07 15.49 22.26 13.86 22.99 12C21.26 7.61 16.99 5 12 5C10.73 5 9.51 5.29 8.41 5.79L10.17 7.55C10.74 7.32 11.35 7.2 12 7.2V7ZM2 4.27L4.28 6.55L4.74 7.01C3.08 8.3 1.78 10.02 1 12C2.73 16.39 7 19 12 19C13.55 19 15.03 18.7 16.38 18.18L17.75 19.55L19.14 20.94L20.45 19.63L3.37 2.55L2 4.27ZM7.53 9.8L9.08 11.35C9.03 11.56 9 11.78 9 12C9 13.66 10.34 15 12 15C12.22 15 12.44 14.97 12.65 14.92L14.2 16.47C13.53 16.8 12.79 17 12 17C9.24 17 7 14.76 7 12C7 11.21 7.2 10.47 7.53 9.8V9.8ZM11.84 9.02L14.99 12.17L15.01 12.01C15.01 10.35 13.67 9.01 12.01 9.01L11.84 9.02Z" fill="currentColor"/>
                        </svg>
                    `;
            } else {
                togglePassword.innerHTML = `
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 9C10.343 9 9 10.343 9 12C9 13.657 10.343 15 12 15C13.657 15 15 13.657 15 12C15 10.343 13.657 9 12 9Z" fill="currentColor"/>
                            <path d="M12 5C7 5 2.73 8.11 1 12.5C2.73 16.89 7 20 12 20C17 20 21.27 16.89 23 12.5C21.27 8.11 17 5 12 5ZM12 17.5C9.24 17.5 7 15.26 7 12.5C7 9.74 9.24 7.5 12 7.5C14.76 7.5 17 9.74 17 12.5C17 15.26 14.76 17.5 12 17.5Z" fill="currentColor"/>
                        </svg>
                    `;
            }
        });
    });
</script>
</body>
</html>