<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Список клиентов | BarberPro CRM</title>
</head>
<body>
<div class="container">
    <h1>Список клиентов</h1>

    <form action="/clients/search" method="get">
        <input type="text" name="keyword" value="${keyword!}" placeholder="Поиск по имени или телефону">
        <button type="submit">Поиск</button>
    </form>

    <a href="/clients/create">Добавить клиента</a>

    <#if clients?has_content>
        <table>
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
                        <a href="/clients/edit/${client.id}">Редактировать</a>
                        <form action="/clients/delete/${client.id}" method="post" style="display:inline">
                            <button type="submit">Удалить</button>
                        </form>
                    </td>
                </tr>
            </#list>
            </tbody>
        </table>
    <#else>
        <p>Клиенты не найдены</p>
    </#if>
</div>
</body>
</html>