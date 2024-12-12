# API Documentation

## 1. Добавление продукта
- **URL**: `/product`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "plu": "string",      // Артикул товара
    "title": "string"     // Название товара
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Добавление продукта",
      "newProduct": {      // Объект нового продукта
        "plu": "string",
        "title": "string"
      },
      "history": "string"  // Сообщение о добавлении в историю
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "message": "Ошибка добавления продукта",
      "error": "string"    // Сообщение об ошибке
    }
    ```

---

## 2. Добавление остатка
- **URL**: `/inventory`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "plu": "string",              // Артикул товара
    "shopId": "integer",          // ID магазина
    "quantityOnShelf": "integer", // Количество на полке
    "quantityInOrder": "integer"  // Количество в заказе
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Новый остаток создан",
      "inventory": {               // Объект нового остатка
        "plu": "string",
        "shop_id": "integer",
        "quantity_on_shelf": "integer",
        "quantity_in_order": "integer"
      },
      "history": "string"          // Сообщение о добавлении в историю
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "message": "Ошибка добавления остатка",
      "error": "string"            // Сообщение об ошибке
    }
    ```

---

## 3. Увеличение остатка
- **URL**: `/inventory/increase`
- **Method**: `PUT`
- **Request Body**:
  ```json
  {
    "plu": "string",                     // Артикул товара
    "shopId": "integer",                 // ID магазина
    "quantityOnShelfIncrease": "integer", // Увеличение количества на полке
    "quantityInOrderIncrease": "integer"  // Увеличение количества в заказе
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Остаток успешно увеличен",
      "updatedInventory": {               // Объект обновленного остатка
        "plu": "string",
        "shop_id": "integer",
        "quantity_on_shelf": "integer",
        "quantity_in_order": "integer"
      },
      "history": "string"                 // Сообщение о добавлении в историю
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "message": "Запись не найдена"
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "message": "Ошибка при увеличении остатка",
      "error": "string"                   // Сообщение об ошибке
    }
    ```

---

## 4. Уменьшение остатка
- **URL**: `/inventory/decrease`
- **Method**: `PUT`
- **Request Body**:
  ```json
  {
    "plu": "string",                     // Артикул товара
    "shopId": "integer",                 // ID магазина
    "quantityOnShelfDecrease": "integer", // Уменьшение количества на полке
    "quantityInOrderDecrease": "integer"  // Уменьшение количества в заказе
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Остаток успешно уменьшен",
      "updatedInventory": {               // Объект обновленного остатка
        "plu": "string",
        "shop_id": "integer",
        "quantity_on_shelf": "integer",
        "quantity_in_order": "integer"
      },
      "history": "string"                 // Сообщение о добавлении в историю
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "message": "Запись не найдена"
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "message": "Ошибка при уменьшении остатка",
      "error": "string"                   // Сообщение об ошибке
    }
    ```

---

## 5. Получение остатков
- **URL**: `/inventory`
- **Method**: `GET`
- **Query Parameters**:
  - `plu`: (optional) Артикул товара
  - `shopId`: (optional) ID магазина
  - `quantityOnShelfMin`: (optional) Минимальное количество на полке
  - `quantityOnShelfMax`: (optional) Максимальное количество на полке
  - `quantityInOrderMin`: (optional) Минимальное количество в заказе
  - `quantityInOrderMax`: (optional) Максимальное количество в заказе
- **Response**:
  - **200 OK**:
    ```json
    [
      {
        "plu": "string",
        "shop_id": "integer",
        "quantity_on_shelf": "integer",
        "quantity_in_order": "integer",
        "product_name": "string" // Название товара
      },
      ...
    ]
    ```
  - **404 Not Found**:
    ```json
    {
      "message": "Записи не найдены"
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "message": "Ошибка при получении остатков",
      "error": "string"            // Сообщение об ошибке
    }
    ```

---

## 6. Получение товара по имени
- **URL**: `/product/name/:name`
- **Method**: `GET`
- **Response**:
  - **200 OK**:
    ```json
    [
      {
        "plu": "string",
        "title": "string"
      },
      ...
    ]
    ```
  - **404 Not Found**:
    ```json
    {
      "message": "Товар c наименованием \"{name}\" не найден"
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "message": "Ошибка при получении товара",
      "error": "string"            // Сообщение об ошибке
    }
    ```

---

## 7. Получение товара по PLU
- **URL**: `/product/plu/:plu`
- **Method**: `GET`
- **Response**:
  - **200 OK**:
    ```json
    {
      "plu": "string",
      "title": "string"
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "message": "Товар c артикулом \"{plu}\" не найден"
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "message": "Ошибка при получении товара",
      "error": "string"            // Сообщение об ошибке
    }
    ```