<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Пользователи | BarberPro CRM</title>
    <link rel="stylesheet" href="/css/users_list.css">
</head>
<body>
<div class="container">
    <div class="header">
        <div class="brand">
            <div class="logo">
                <svg viewBox="0 0 24 24">
                    <path d="M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2M21,9V7L15,5.5V7H9V5.5L3,7V9L9,10.5V12L3,13.5V15.5L9,14V16L3,17.5V19.5L9,18V22H15V18L21,19.5V17.5L15,16V14L21,15.5V13.5L15,12V10.5L21,9Z"/>
                </svg>
            </div>
            <div class="brand-text">
                <h1>BarberPro CRM</h1>
                <p>Профессиональная система управления</p>
            </div>
        </div>
        <div class="nav-links">
            <a href="/dashboard">Главная</a>
            <a href="/users">Пользователи</a>
            <a href="/clients">Клиенты</a>
            <a href="/appointments">Записи</a>
        </div>
    </div>

    <div class="content">
        <div class="page-header">
            <div>
                <h1 class="page-title">Список пользователей</h1>
                <p class="page-subtitle">Управление учетными записями сотрудников</p>
            </div>
            <a href="/users/create" class="add-user-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
                Добавить пользователя
            </a>
        </div>

        <#if users?has_content>
            <table class="users-table">
                <thead>
                <tr>
                    <th>Имя пользователя</th>
                    <th>Роль</th>
                    <th>Активен</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                <#list users as user>
                    <tr>
                        <td>${user.username}</td>
                        <td>
                            <span class="role-badge <#if user.role.getRoleName() == 'ADMIN'>role-admin<#else>role-user</#if>">
                                ${user.role.getRoleName()}
                            </span>
                        </td>
                        <td>
                            <span class="<#if user.active>status-active<#else>status-inactive</#if>">
                                ${user.active?string("Да","Нет")}
                            </span>
                        </td>
                        <td class="action-buttons">
                            <!-- Редактировать -->
                            <a class="btn btn-edit" href="/users/edit/${user.id}">Редактировать</a>

                            <!-- Удалить -->
                            <form action="/users/delete/${user.id}" method="post" style="display:inline">
                                <button type="submit" class="btn btn-delete">Удалить</button>
                            </form>
                        </td>
                    </tr>
                </#list>
                </tbody>
            </table>
        <#else>
            <div class="no-users">
                <p>Пользователи не найдены</p>
            </div>
        </#if>
    </div>
</div>
</body>
