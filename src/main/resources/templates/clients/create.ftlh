<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Создать клиента | BarberPro CRM</title>
    <link rel="stylesheet" href="/login.css">
</head>
<body>
<div class="container">
    <h1>Создать клиента</h1>
    <form action="/clients/create" method="post">
        <label>Имя:</label>
        <input type="text" name="firstName" value="${clientRequest.firstName!}" required>

        <label>Фамилия:</label>
        <input type="text" name="lastName" value="${clientRequest.lastName!}" required>

        <label>Телефон:</label>
        <input type="text" name="phoneNumber" value="${clientRequest.phoneNumber!}" required>

        <!-- Добавь остальные поля при необходимости -->

        <button type="submit">Создать</button>
    </form>
    <a href="/clients">Назад к списку</a>
</div>
</body>
</html>