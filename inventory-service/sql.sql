// создаём стол с товарами
CREATE TABLE product (
    id SERIAL PRIMARY KEY,
    plu VARCHAR NOT NULL UNIQUE,
    title VARCHAR NOT NULL
);

// таблица с магазинами
CREATE TABLE shops (
    shop_id SERIAL PRIMARY KEY,
    shop_name VARCHAR(255) NOT NULL
);

// создаём 3 тестовых магазина
INSERT INTO shops (shop_name) VALUES
('Магазин 1'),
('Магазин 2'),
('Магазин 3');

// создаим 3 тестовых товара
INSERT INTO product (plu, title) VALUES
('1111', 'телефон'),
('2222', 'телевизор'),
('3333', 'ноутбук');

// создаём таблицу для остатков
CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,                                
    plu VARCHAR(255) NOT NULL,                                
    shop_id INT NOT NULL,                                   
    quantity_on_shelf INT NOT NULL DEFAULT 0 CHECK (quantity_on_shelf >= 0),
    quantity_in_order INT NOT NULL DEFAULT 0 CHECK (quantity_in_order >= 0),  
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,       
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP       
);

// создаём триггер, который будет обновлять поле updated_at после каждой операции обновления
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

// создаём таблицу events
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
