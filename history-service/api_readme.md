# Описание работы API для получения отфильтрованных событий

## Эндпоинт
- **URL**: `/history`
- **Method**: `GET`

## Описание
Этот API-метод позволяет получать события из таблицы `history` с возможностью фильтрации по различным параметрам. Он поддерживает пагинацию и сортировку по времени.

## Установка и настройка

### 1. Клонирование репозитория

Сначала клонируйте репозиторий на ваш локальный компьютер:

### 2. Установка Node.js

Убедитесь, что у вас установлен Node.js. Вы можете скачать его с [официального сайта Node.js](https://nodejs.org/).

### 3. Установка зависимостей

После клонирования репозитория установите все необходимые зависимости:

```bash
npm install
```

### 4. Установка PostgreSQL

(если вы не сделали этого раньше в проекте inventory)
Убедитесь, что у вас установлен PostgreSQL. Вы можете скачать его с [официального сайта PostgreSQL](https://www.postgresql.org/download/).

### 5. Создание базы данных и таблиц

(если вы не сделали этого раньше в проекте inventory)
После установки PostgreSQL создайте базу данных для вашего проекта. Вы можете использовать командную строку или pgAdmin.
Незабудьте обновить данные в файле db.js


javaScript:
```
const pool = new Pool({
  user: 'postgres',
  password: 'your_password',
  host: 'localhost',
  port: 5432,
  database: 'your_database_name',
});
```

#### Пример создания базы данных через psql:

(если вы не сделали этого раньше в проекте inventory)
```bash
psql -U your_username
CREATE DATABASE your_database_name;
```

#### Создание таблиц

(если вы не сделали этого раньше в проекте inventory)
После создания базы данных выполните SQL-запросы для создания необходимых таблиц. Вы можете использовать psql или любой другой SQL-клиент.

```sql
-- Таблица для товаров
CREATE TABLE product (
    id SERIAL PRIMARY KEY,
    plu VARCHAR NOT NULL UNIQUE,
    title VARCHAR NOT NULL
);

-- Таблица для магазинов
CREATE TABLE shops (
    shop_id SERIAL PRIMARY KEY,
    shop_name VARCHAR(255) NOT NULL
);

-- Таблица для остатков
CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    plu VARCHAR(255) NOT NULL,
    shop_id INT NOT NULL,
    quantity_on_shelf INT NOT NULL DEFAULT 0 CHECK (quantity_on_shelf >= 0),
    quantity_in_order INT NOT NULL DEFAULT 0 CHECK (quantity_in_order >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для событий
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    action VARCHAR NOT NULL,
    plu VARCHAR,
    shopid INT,
    quantityshell INT,
    quantityorder INT,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    httpinfo VARCHAR
);
```

### 6. Запуск сервиса

После настройки базы данных и таблиц вы можете запустить ваш API:

```bash
npm run start
```

## Параметры запроса (Query Parameters)
Метод принимает следующие параметры в строке запроса:

- `action` (string, optional): Фильтрует события по типу действия (например, "Добавление продукта").
- `plu` (string, optional): Фильтрует события по артикулу товара.
- `shopId` (integer, optional): Фильтрует события по ID магазина.
- `quantityShellFrom` (integer, optional): Фильтрует события, где количество на полке больше или равно указанному значению.
- `quantityShellTo` (integer, optional): Фильтрует события, где количество на полке меньше или равно указанному значению.
- `quantityOrderFrom` (integer, optional): Фильтрует события, где количество в заказе больше или равно указанному значению.
- `quantityOrderTo` (integer, optional): Фильтрует события, где количество в заказе меньше или равно указанному значению.
- `startDate` (string, optional): Фильтрует события, произошедшие после указанной даты (формат: `YYYY-MM-DD`).
- `endDate` (string, optional): Фильтрует события, произошедшие до указанной даты (формат: `YYYY-MM-DD`).
- `page` (integer, optional): Номер страницы для пагинации (по умолчанию 1).
- `limit` (integer, optional): Количество записей на странице (по умолчанию 10).

## Логика работы
1. **Извлечение параметров**: Метод извлекает параметры из строки запроса и инициализирует массивы для условий фильтрации и параметров запроса.
  
2. **Формирование условий**: Для каждого переданного параметра, который не равен `undefined`, добавляется соответствующее условие в массив `conditions`, а также значение этого параметра в массив `params`.

3. **Формирование SQL-запроса**:
   - Начинается с базового запроса `SELECT * FROM history`.
   - Если есть условия фильтрации, они добавляются в запрос с помощью `WHERE`.
   - Запрос сортируется по времени (`ORDER BY timestamp DESC`).
   - Добавляются параметры для пагинации с использованием `LIMIT` и `OFFSET`.

4. **Выполнение запроса**: Запрос выполняется с использованием `db.query(query, params)`.

5. **Получение общего количества записей**: Выполняется дополнительный запрос для получения общего количества записей, соответствующих условиям фильтрации.

6. **Формирование ответа**: Возвращается JSON-объект, содержащий:
   - `events`: массив событий, соответствующих фильтрам.
   - `page`: текущая страница.
   - `limit`: количество записей на странице.
   - `totalCount`: общее количество записей, соответствующих условиям фильтрации.

7. **Обработка ошибок**: В случае возникновения ошибки при выполнении запроса возвращается статус 500 с сообщением об ошибке.

## Пример запроса
```http
GET /history?action=Добавление продукта&plu=1111&shopId=1&quantityShellFrom=5&page=1&limit=10
```

## Пример ответа
```json
{
  "events": [
    {
      "id": 1,
      "action": "Добавление продукта",
      "plu": "1111",
      "shopid": 1,
      "quantityshell": 10,
      "quantityorder": 5,
      "timestamp": "2023-01-01T12:00:00Z"
    },
    ...
  ],
  "page": 1,
  "limit": 10,
  "totalCount": 100
}
```

## Заключение
Этот API-метод предоставляет способ фильтрации и получения событий из таблицы `history`, что позволяет пользователям легко находить нужные данные по различным критериям.