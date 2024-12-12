# SQL Tables Documentation

## 1. Таблица `product`
- **Описание**: Таблица для хранения информации о товарах.
- **Структура**:
  ```sql
  CREATE TABLE product (
      id SERIAL PRIMARY KEY,          -- Уникальный идентификатор товара
      plu VARCHAR NOT NULL UNIQUE,    -- Артикул товара (должен быть уникальным)
      title VARCHAR NOT NULL           -- Название товара
  );
  ```

## 2. Таблица `shops`
- **Описание**: Таблица для хранения информации о магазинах.
- **Структура**:
  ```sql
  CREATE TABLE shops (
      shop_id SERIAL PRIMARY KEY,      -- Уникальный идентификатор магазина
      shop_name VARCHAR(255) NOT NULL  -- Название магазина
  );
  ```

### Пример вставки тестовых данных в таблицу `shops`:
```sql
INSERT INTO shops (shop_name) VALUES
('Магазин 1'),
('Магазин 2'),
('Магазин 3');
```

## 3. Таблица `inventory`
- **Описание**: Таблица для хранения информации о остатках товаров в магазинах.
- **Структура**:
  ```sql
  CREATE TABLE inventory (
      id SERIAL PRIMARY KEY,                                 -- Уникальный идентификатор записи
      plu VARCHAR(255) NOT NULL,                             -- Артикул товара
      shop_id INT NOT NULL,                                  -- ID магазина
      quantity_on_shelf INT NOT NULL DEFAULT 0 CHECK (quantity_on_shelf >= 0),  -- Количество на полке
      quantity_in_order INT NOT NULL DEFAULT 0 CHECK (quantity_in_order >= 0),  -- Количество в заказе
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,       -- Дата и время создания записи
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP        -- Дата и время последнего обновления записи
  );
  ```

### Триггер для обновления поля `updated_at`
- **Описание**: Триггер, который обновляет поле `updated_at` после каждой операции обновления.
- **Структура**:
  ```sql
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;  
      RETURN NEW;                        
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER update_inventory_updated_at
  BEFORE UPDATE ON inventory
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
  ```

## 4. Таблица `events`
- **Описание**: Таблица для хранения информации о событиях, связанных с товарами.
- **Структура**:
  ```sql
  CREATE TABLE events (
      id SERIAL PRIMARY KEY,          -- Уникальный идентификатор события
      action VARCHAR NOT NULL,        -- Действие, связанное с событием
      plu VARCHAR,                    -- Артикул товара
      shopid INT,                     -- ID магазина
      quantityshell INT,              -- Количество на полке
      quantityorder INT,              -- Количество в заказе
      timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Временная метка события
      httpinfo VARCHAR                 -- Дополнительная информация о HTTP-запросе
  );
  ```
