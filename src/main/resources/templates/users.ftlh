<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Пользователи | BarberPro CRM</title>
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
            background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%231a1a1a"/><path d="M30,30 L70,30 L70,70 L30,70 Z" fill="none" stroke="%23d4af37" stroke-width="2"/><path d="M40,40 L60,40 L60,60 L40,60 Z" fill="none" stroke="%23d4af37" stroke-width="1"/></svg>');
            background-size: cover;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .header {
            background: var(--primary);
            color: white;
            padding: 30px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            overflow: hidden;
        }

        .header::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, transparent 0%, rgba(212, 175, 55, 0.1) 100%);
        }

        .brand {
            display: flex;
            align-items: center;
            gap: 15px;
            position: relative;
            z-index: 1;
        }

        .logo {
            width: 50px;
            height: 50px;
            background: var(--accent);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .logo svg {
            width: 30px;
            height: 30px;
            fill: var(--primary);
        }

        .brand-text h1 {
            font-size: 24px;
            margin-bottom: 5px;
        }

        .brand-text p {
            color: var(--gray);
            font-size: 14px;
        }

        .nav-links {
            display: flex;
            gap: 20px;
            position: relative;
            z-index: 1;
        }

        .nav-links a {
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 5px;
            transition: all 0.3s;
        }

        .nav-links a:hover {
            background: rgba(212, 175, 55, 0.2);
        }

        .content {
            padding: 40px;
        }

        .page-header {
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .page-title {
            font-size: 32px;
            color: var(--primary);
            margin-bottom: 10px;
        }

        .page-subtitle {
            color: var(--gray);
            font-size: 16px;
        }

        .add-user-btn {
            background: var(--accent);
            color: var(--primary);
            border: none;
            padding: 12px 24px;
            border-radius: 5px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s;
        }

        .add-user-btn:hover {
            background: #e6c34d;
            transform: translateY(-2px);
        }

        .users-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .users-table th {
            background: var(--primary);
            color: white;
            padding: 15px;
            text-align: left;
            font-weight: 600;
        }

        .users-table td {
            padding: 15px;
            border-bottom: 1px solid #eee;
        }

        .users-table tr:hover {
            background: #f8f9fa;
        }

        .role-badge {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }

        .role-admin {
            background: #e74c3c;
            color: white;
        }

        .role-user {
            background: #3498db;
            color: white;
        }

        .status-active {
            color: var(--success);
            font-weight: 600;
        }

        .status-inactive {
            color: var(--error);
            font-weight: 600;
        }

        .no-users {
            text-align: center;
            padding: 60px 20px;
            color: var(--gray);
            font-size: 18px;
        }

        .action-buttons {
            display: flex;
            gap: 10px;
        }

        .btn {
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
            transition: all 0.3s;
        }

        .btn-edit {
            background: #f39c12;
            color: white;
        }

        .btn-delete {
            background: #e74c3c;
            color: white;
        }

        .btn:hover {
            opacity: 0.9;
            transform: translateY(-1px);
        }

        @media (max-width: 768px) {
            .header {
                flex-direction: column;
                gap: 20px;
                text-align: center;
            }

            .nav-links {
                flex-wrap: wrap;
                justify-content: center;
            }

            .users-table {
                display: block;
                overflow-x: auto;
            }

            .page-header {
                flex-direction: column;
                gap: 20px;
                text-align: center;
            }
        }
    </style>



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
