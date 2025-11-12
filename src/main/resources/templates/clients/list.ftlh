<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Список клиентов | BarberPro CRM</title>
    <link rel="stylesheet" href="/css/client_css/client.css">
</head>
<body>
<div class="container">
    <div class="layout-header">
        <div class="layout-brand">
            <div class="logo">
                <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor">
                    <path d="M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2M21,9V7L15,5.5V7H9V5.5L3,7V9L9,10.5V12L3,13.5V15.5L9,14V16L3,17.5V19.5L9,18V22H15V18L21,19.5V17.5L15,16V14L21,15.5V13.5L15,12V10.5L21,9Z"/>
                </svg>
            </div>
            <div>
                <h1>BarberPro CRM</h1>
                <p>Управление клиентами</p>
            </div>
        </div>
        <nav class="layout-nav">
            <a href="/dashboard">Главная</a>
            <a href="/users">Пользователи</a>
            <a href="/clients" class="active">Клиенты</a>
            <a href="/appointments">Записи</a>
        </nav>
    </div>

    <div class="page-header">
        <div>
            <h1 class="page-title">Список клиентов</h1>
            <p class="page-subtitle">Управление базой клиентов барбершопа</p>
        </div>
        <a href="/clients/create" class="btn btn-accent">Добавить клиента</a>
    </div>

    <form action="/clients/search" method="get" class="search-form">
        <input type="text" name="keyword" value="${keyword!}" placeholder="Поиск по имени, фамилии или телефону"
               class="search-input">
        <button type="submit" class="search-btn">Найти</button>
    </form>

    <#if clients?has_content>
        <table class="data-table clients-table">
            <thead>
            <tr>
                <th>Имя</th>
                <th>Фамилия</th>
                <th>Телефон</th>
                <th>Действия</th>
            </tr>
            </thead>
            <tbody>
            <#list clients as client>
                <tr>
                    <td>${client.firstName}</td>
                    <td>${client.lastName}</td>
                    <td>${client.phoneNumber}</td>
                    <td>
                        <div class="client-actions">
                            <a href="/clients/edit/${client.id}" class="client-action-btn btn-edit">Редактировать</a>
                            <form action="/clients/delete/${client.id}" method="post" style="display:inline">
                                <button type="submit" class="client-action-btn btn-delete"
                                        onclick="return confirm('Удалить клиента?')">Удалить
                                </button>
                            </form>
                        </div>
                    </td>
                </tr>
            </#list>
            </tbody>
        </table>
    <#else>
        <div class="empty-state clients-empty">
            <p>Клиенты не найдены</p>
            <a href="/clients/create" class="btn btn-accent">Добавить первого клиента</a>
        </div>
    </#if>
</div>
</body>
</html>