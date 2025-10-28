class LoginForm {
    constructor() {
        this.init();
    }

    init() {
        this.togglePassword = document.getElementById('togglePassword');
        this.passwordInput = document.getElementById('password');
        this.loginForm = document.getElementById('loginForm');
        this.usernameError = document.getElementById('usernameError');
        this.passwordError = document.getElementById('passwordError');

        this.setupEventListeners();
        this.setInitialPasswordIcon();
    }

    setupEventListeners() {
        // Toggle password visibility
        this.togglePassword.addEventListener('click', () => {
            this.togglePasswordVisibility();
        });

        // Form submission
        this.loginForm.addEventListener('submit', (e) => {
            this.handleFormSubmit(e);
        });

        // Real-time validation
        document.getElementById('username').addEventListener('input', () => {
            this.hideError(this.usernameError);
        });

        this.passwordInput.addEventListener('input', () => {
            this.hideError(this.passwordError);
        });
    }

    setInitialPasswordIcon() {
        this.updatePasswordIcon('password');
    }

    togglePasswordVisibility() {
        const type = this.passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        this.passwordInput.setAttribute('type', type);
        this.updatePasswordIcon(type);
    }

    updatePasswordIcon(type) {
        if (type === 'text') {
            this.togglePassword.innerHTML = this.getHiddenPasswordIcon();
        } else {
            this.togglePassword.innerHTML = this.getVisiblePasswordIcon();
        }
    }

    getVisiblePasswordIcon() {
        return `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 9C10.343 9 9 10.343 9 12C9 13.657 10.343 15 12 15C13.657 15 15 13.657 15 12C15 10.343 13.657 9 12 9Z" fill="currentColor"/>
                <path d="M12 5C7 5 2.73 8.11 1 12.5C2.73 16.89 7 20 12 20C17 20 21.27 16.89 23 12.5C21.27 8.11 17 5 12 5ZM12 17.5C9.24 17.5 7 15.26 7 12.5C7 9.74 9.24 7.5 12 7.5C14.76 7.5 17 9.74 17 12.5C17 15.26 14.76 17.5 12 17.5Z" fill="currentColor"/>
            </svg>
        `;
    }

    getHiddenPasswordIcon() {
        return `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 7C14.76 7 17 9.24 17 12C17 12.65 16.87 13.26 16.64 13.83L19.56 16.75C21.07 15.49 22.26 13.86 22.99 12C21.26 7.61 16.99 5 12 5C10.73 5 9.51 5.29 8.41 5.79L10.17 7.55C10.74 7.32 11.35 7.2 12 7.2V7ZM2 4.27L4.28 6.55L4.74 7.01C3.08 8.3 1.78 10.02 1 12C2.73 16.39 7 19 12 19C13.55 19 15.03 18.7 16.38 18.18L17.75 19.55L19.14 20.94L20.45 19.63L3.37 2.55L2 4.27ZM7.53 9.8L9.08 11.35C9.03 11.56 9 11.78 9 12C9 13.66 10.34 15 12 15C12.22 15 12.44 14.97 12.65 14.92L14.2 16.47C13.53 16.8 12.79 17 12 17C9.24 17 7 14.76 7 12C7 11.21 7.2 10.47 7.53 9.8V9.8ZM11.84 9.02L14.99 12.17L15.01 12.01C15.01 10.35 13.67 9.01 12.01 9.01L11.84 9.02Z" fill="currentColor"/>
            </svg>
        `;
    }

    handleFormSubmit(e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = this.passwordInput.value;

        // Reset errors
        this.hideError(this.usernameError);
        this.hideError(this.passwordError);

        let isValid = true;

        if (!username) {
            this.showError(this.usernameError);
            isValid = false;
        }

        if (!password) {
            this.showError(this.passwordError);
            isValid = false;
        }

        if (isValid) {
            this.submitForm();
        }
    }

    showError(errorElement) {
        errorElement.style.display = 'block';
    }

    hideError(errorElement) {
        errorElement.style.display = 'none';
    }

    submitForm() {
        // В реальном приложении здесь будет отправка формы
        console.log('Форма отправлена');

        // Показать сообщение об успехе (в демо-режиме)
        this.showSuccessMessage();

        // В продакшене раскомментировать:
        // this.loginForm.submit();
    }

    showSuccessMessage() {
        // Создаем временное сообщение об успехе
        const successMsg = document.createElement('div');
        successMsg.textContent = 'Вход выполняется...';
        successMsg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--accent);
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 1000;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        `;

        document.body.appendChild(successMsg);

        // Удаляем сообщение через 3 секунды
        setTimeout(() => {
            document.body.removeChild(successMsg);
        }, 3000);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new LoginForm();
});