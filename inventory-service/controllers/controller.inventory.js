/* eslint-disable class-methods-use-this */
const db = require('../db');
const handler = require('../handlers');

class InventoryController {
  async postProduct(req, res) {
    const { plu, title } = req.body;
    try {
      const newProduct = await db.query(
        'INSERT INTO product(plu, title) values ($1, $2) RETURNING *',
        [plu, title],
      );

      const response = await handler.sendEvent('Добавление продукта', plu, null, null, null, handler.getHttpRequest(req));

      return res.json({ message: 'Добавление продукта', newProduct: newProduct.rows[0], history: response && response.data ? response.data : 'Ошибка добавления собатия в таблицу history' });
    } catch (error) {
      return res.status(500).json({ message: 'Ошибка добавления продукта', error: error.message });
    }
  }

  async postInventory(req, res) {
    const {
      plu,
      shopId,
      quantityOnShelf,
      quantityInOrder,
    } = req.body;
    try {
      await handler.checkExistence(
        'SELECT * FROM product WHERE plu = $1',
        [plu],
        `Товар с указанным PLU "${plu}" не найден`,
      );

      await handler.checkExistence(
        'SELECT * FROM shops WHERE shop_id = $1',
        [shopId],
        `Магазин с указанным ID "${shopId}" не найден`,
      );

      const existingInventory = await db.query(
        'SELECT * FROM inventory WHERE plu = $1 AND shop_id = $2',
        [plu, shopId],
      );

      let inventory;

      if (existingInventory.rows.length > 0) {
        inventory = await db.query(
          'UPDATE inventory SET quantity_on_shelf = quantity_on_shelf + $1, quantity_in_order = quantity_in_order + $2 WHERE plu = $3 AND shop_id = $4 RETURNING *',
          [quantityOnShelf, quantityInOrder, plu, shopId],
        );
      } else {
        inventory = await db.query(
          'INSERT INTO inventory (plu, shop_id, quantity_on_shelf, quantity_in_order) VALUES ($1, $2, $3, $4) RETURNING *',
          [plu, shopId, quantityOnShelf, quantityInOrder],
        );
      }
      const response = await handler.sendEvent('Добавление остатка', plu, shopId, quantityOnShelf, quantityInOrder, handler.getHttpRequest(req));

      return res.json({ message: 'Новый остаток создан', inventory: inventory.rows[0], history: response && response.data ? response.data : 'Ошибка добавления собатия в таблицу history' });
    } catch (error) {
      return res.status(500).json({ message: 'Ошибка добавления остатка', error: error.message });
    }
  }

  async increaseInventory(req, res) {
    const {
      plu,
      shopId,
      quantityOnShelfIncrease,
      quantityInOrderIncrease,
    } = req.body;

    try {
      await handler.checkExistence(
        'SELECT * FROM product WHERE plu = $1',
        [plu],
        `Товар с указанным PLU "${plu}" не найден`,
      );

      await handler.checkExistence(
        'SELECT * FROM shops WHERE shop_id = $1',
        [shopId],
        `Магазин с указанным ID "${shopId}" не найден`,
      );

      const result = await db.query(
        `UPDATE inventory
          SET quantity_on_shelf = quantity_on_shelf + $1,
          quantity_in_order = quantity_in_order + $2
          WHERE plu = $3 AND shop_id = $4 RETURNING *`,
        [quantityOnShelfIncrease, quantityInOrderIncrease, plu, shopId],
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Запись не найдена' });
      }
      const response = await handler.sendEvent('Увеличение остатка', plu, shopId, quantityOnShelfIncrease, quantityInOrderIncrease, handler.getHttpRequest(req));
      return res.json({ message: 'Остаток успешно увеличен', updatedInventory: result.rows[0], history: response && response.data ? response.data : 'Ошибка добавления собатия в таблицу history' });
    } catch (error) {
      return res.status(500).json({ message: 'Ошибка при увеличении остатка', error: error.message });
    }
  }

  async decreaseInventory(req, res) {
    const {
      plu,
      shopId,
      quantityOnShelfDecrease,
      quantityInOrderDecrease,
    } = req.body;

    try {
      await handler.checkExistence(
        'SELECT * FROM product WHERE plu = $1',
        [plu],
        `Товар с указанным PLU "${plu}" не найден`,
      );

      await handler.checkExistence(
        'SELECT * FROM shops WHERE shop_id = $1',
        [shopId],
        `Магазин с указанным ID "${shopId}" не найден`,
      );

      const result = await db.query(
        `UPDATE inventory
          SET quantity_on_shelf = quantity_on_shelf - $1,
          quantity_in_order = quantity_in_order - $2
          WHERE plu = $3 AND shop_id = $4 RETURNING *`,
        [quantityOnShelfDecrease, quantityInOrderDecrease, plu, shopId],
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Запись не найдена' });
      }
      const response = await handler.sendEvent('Уменьшение остатка', plu, shopId, quantityOnShelfDecrease, quantityInOrderDecrease, handler.getHttpRequest(req));
      return res.json({ message: 'Остаток успешно уменьшен', updatedInventory: result.rows[0], history: response && response.data ? response.data : 'Ошибка добавления собатия в таблицу history' });
    } catch (error) {
      return res.status(500).json({ message: 'Ошибка при уменьшении остатка', error: error.message });
    }
  }

  async getInventory(req, res) {
    const {
      plu,
      shopId,
      quantityOnShelfMin,
      quantityOnShelfMax,
      quantityInOrderMin,
      quantityInOrderMax,
    } = req.query;

    try {
      let query = `
            SELECT i.*, p.plu, p.title AS product_name
            FROM inventory i
            JOIN product p ON i.plu = p.plu
            WHERE 1=1`;
      const params = [];
      let paramIndex = 1;

      if (plu) {
        query += ` AND p.plu = $${paramIndex}`;
        params.push(plu);
        paramIndex += 1;
      }

      if (shopId) {
        query += ` AND i.shop_id = $${paramIndex}`;
        params.push(shopId);
        paramIndex += 1;
      }

      if (quantityOnShelfMin !== undefined) {
        query += ` AND i.quantity_on_shelf >= $${paramIndex}`;
        params.push(quantityOnShelfMin);
        paramIndex += 1;
      }

      if (quantityOnShelfMax !== undefined) {
        query += ` AND i.quantity_on_shelf <= $${paramIndex}`;
        params.push(quantityOnShelfMax);
        paramIndex += 1;
      }

      if (quantityInOrderMin !== undefined) {
        query += ` AND i.quantity_in_order >= $${paramIndex}`;
        params.push(quantityInOrderMin);
        paramIndex += 1;
      }

      if (quantityInOrderMax !== undefined) {
        query += ` AND i.quantity_in_order <= $${paramIndex}`;
        params.push(quantityInOrderMax);
      }

      const result = await db.query(query, params);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Записи не найдены' });
      }

      return res.json(result.rows);
    } catch (error) {
      return res.status(500).json({ message: 'Ошибка при получении остатков', error: error.message });
    }
  }

  async getProductByName(req, res) {
    const { name } = req.params;
    try {
      const result = await db.query(
        'SELECT * FROM product WHERE title ILIKE $1',
        [name],
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: `Товар c наименованием "${name}" найден` });
      }
      return res.json(result.rows);
    } catch (error) {
      return res.status(500).json({ message: 'Ошибка при получении товара', error: error.message });
    }
  }

  async getProductByPlu(req, res) {
    const { plu } = req.params;
    try {
      const result = await db.query(
        'SELECT * FROM product WHERE plu = $1',
        [plu],
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: `Товар c артикулом "${plu}" не найден` });
      }
      return res.json(result.rows[0]);
    } catch (error) {
      return res.status(500).json({ message: 'Ошибка при получении товара', error: error.message });
    }
  }
}

module.exports = new InventoryController();
