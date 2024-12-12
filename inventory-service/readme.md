# API Documentation and Setup Guide

## Описание

Этот проект представляет собой API для управления товарами и остатками в магазинах. Он взаимодействует с другим сервисом (history), который записывает все события, происходящие в системе.
Для корректной работы рекомендуется запускать оба сервиса паралельно.

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

Убедитесь, что у вас установлен PostgreSQL. Вы можете скачать его с [официального сайта PostgreSQL](https://www.postgresql.org/download/).

### 5. Создание базы данных и таблиц

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

```bash
psql -U your_username
CREATE DATABASE your_database_name;
```

#### Создание таблиц

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

### 7. Взаимодействие с сервисом history

Этот сервис обращается к другому сервису (history), который записывает все события, происходящие в системе. Убедитесь, что сервис history запущен и доступен по адресу, указанному в конфигурации вашего API.

### 8. Примеры запросов к API

- **Добавление продукта**:
  ```bash
  POST /product
  {
    "plu": "1111",
    "title": "телефон"
  }
  ```

- **Добавление остатка**:
  ```bash
  POST /inventory
  {
    "plu": "1111",
    "shopId": 1,
    "quantityOnShelf": 10,
    "quantityInOrder": 5
  }
  ```

- **Увеличение остатка**:
  ```bash
  PUT /inventory/increase
  {
    "plu": "1111",
    "shopId": 1,
    "quantityOnShelfIncrease": 5,
    "quantityInOrderIncrease": 2
  }
  ```

- **Получение остатков**:
  ```bash
  GET /inventory?plu=1111&shopId=1
  ```

## Заключение

Следуя этому руководству, вы сможете настроить и запустить API для управления товарами и остатками в магазинах. Убедитесь, что все зависимости установлены, и база данных настроена правильно. Если у вас возникнут вопросы, обратитесь к документации или создайте issue в репозитории.