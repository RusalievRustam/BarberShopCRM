<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Редактировать клиента | BarberPro CRM</title>
    <link rel="stylesheet" href="/css/client_css/client.css">
</head>
<body>
<div class="client-form-container">
    <div class="client-form-brand-section">
        <div class="client-form-logo">
            <svg viewBox="0 0 24 24">
                <path d="M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2M21,9V7L15,5.5V7H9V5.5L3,7V9L9,10.5V12L3,13.5V15.5L9,14V16L3,17.5V19.5L9,18V22H15V18L21,19.5V17.5L15,16V14L21,15.5V13.5L15,12V10.5L21,9Z"/>
            </svg>
        </div>
        <h1>BarberPro CRM</h1>
        <p>Редактирование данных клиента</p>
    </div>

    <div class="client-form-section">
        <a href="/clients" class="back-link">Назад к списку клиентов</a>

        <div class="client-form-header">
            <h1>Редактировать клиента</h1>
            <p>Измените информацию о клиенте</p>
        </div>

        <form action="/clients/edit/${clientId}" method="post">
            <div class="form-group">
                <label for="firstName">Имя:</label>
                <input type="text" id="firstName" name="firstName" value="${clientRequest.firstName!}" required>
            </div>

            <div class="form-group">
                <label for="lastName">Фамилия:</label>
                <input type="text" id="lastName" name="lastName" value="${clientRequest.lastName!}" required>
            </div>

            <div class="form-group">
                <label for="phoneNumber">Телефон:</label>
                <input type="text" id="phoneNumber" name="phoneNumber" value="${clientRequest.phoneNumber!}" required class="phone-input">
            </div>

            <div class="client-form-actions">
                <a href="/clients" class="btn btn-cancel">Отмена</a>
                <button type="submit" class="btn btn-primary btn-submit">Сохранить изменения</button>
            </div>
        </form>
    </div>
</div>
</body>
</html>