# Тестовое задание для компании Effective Mobile

В проекте реализовано два сервиса: CRUD пользователей и история действий с пользователями. Для общения сервисов используется rabbitmq. База данных - postgresql (для каждого сервиса своя).

## Запуск проекта

 1. Клонируйте репозиторий git clone
 2. Запустите командой docker-compose up
 
## API Endpoints

Сервис действий с пользователями:
GET http://localhost:3000/users - получить список пользователей 
POST http://localhost:3000/users - создать нового пользователя

>Тело запроса:
JSON
{
"firstname":"Alex",
"surname":"Test",
"email":"alex@mail.ru",
"age":"10"
}

PATCH http://localhost:3000/users/:id - изменить пользователя (менять можно произвольное количество полей)
> Тело запроса:
> JSON
> {
"firstname":"Alex",
"surname":"Test",
"email":"alex@mail.ru",
"age":"10"
> }

Сервис история действий пользователя:
GET http://localhost:5000/actions?offset=0&limit=20&userId=1 - если указать параметр userId будет выведена история действий с конкретным пользователем.