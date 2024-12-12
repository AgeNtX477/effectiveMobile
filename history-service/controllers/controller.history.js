/* eslint-disable prefer-template */
/* eslint-disable class-methods-use-this */
const db = require('../db');

class HistoryController {
  async postEvent(req, res) {
    const {
      action,
      plu,
      shopId,
      quantityShell,
      quantityOrder,
      timestamp,
      httpInfo,
    } = req.body;
    try {
      const result = await db.query(
        'INSERT INTO history (action, plu, shopid, quantityshell, quantityorder, timestamp, httpinfo) values ($1, $2, $3, $4, $5, $6, $7)',
        [action, plu, shopId, quantityShell, quantityOrder, timestamp, httpInfo],
      );
      return result.rowCount > 0
        ? res.json({ message: 'Запись в таблице history создана' })
        : res.status(400).json({ message: 'Не удалось создать запись в таблице history' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Ошибка добавления записи в таблицу истории', error: error.message });
    }
  }

  async getFilteredEvents(req, res) {
    const {
      action,
      plu,
      shopId,
      quantityShellFrom,
      quantityShellTo,
      quantityOrderFrom,
      quantityOrderTo,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;

    const conditions = [];
    const params = [];
    let paramIndex = 1;

    if (action) {
      conditions.push(`action = $${paramIndex}`);
      params.push(action);
      paramIndex += 1;
    }

    if (plu) {
      conditions.push(`plu = $${paramIndex}`);
      params.push(plu);
      paramIndex += 1;
    }

    if (shopId) {
      conditions.push(`shopid = $${paramIndex}`);
      params.push(shopId);
      paramIndex += 1;
    }

    if (quantityShellFrom !== undefined) {
      conditions.push(`quantityshell >= $${paramIndex}`);
      params.push(quantityShellFrom);
      paramIndex += 1;
    }
    if (quantityShellTo !== undefined) {
      conditions.push(`quantityshell <= $${paramIndex}`);
      params.push(quantityShellTo);
      paramIndex += 1;
    }

    if (quantityOrderFrom !== undefined) {
      conditions.push(`quantityorder >= $${paramIndex}`);
      params.push(quantityOrderFrom);
      paramIndex += 1;
    }
    if (quantityOrderTo !== undefined) {
      conditions.push(`quantityorder <= $${paramIndex}`);
      params.push(quantityOrderTo);
      paramIndex += 1;
    }

    if (startDate) {
      conditions.push(`timestamp >= $${paramIndex}`);
      params.push(startDate);
      paramIndex += 1;
    }
    if (endDate) {
      conditions.push(`timestamp <= $${paramIndex}`);
      params.push(endDate);
      paramIndex += 1;
    }

    let query = 'SELECT * FROM history';

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY timestamp DESC';

    const offset = (page - 1) * limit;
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    try {
      const result = await db.query(query, params);

      const countQuery = conditions.length > 0
        ? 'SELECT COUNT(*) FROM history WHERE ' + conditions.join(' AND ')
        : 'SELECT COUNT(*) FROM history';

      const totalCount = await db.query(countQuery, params.slice(0, -2));

      return res.json({
        events: result.rows,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalCount: parseInt(totalCount.rows[0].count, 10),
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Ошибка при получении истории событий',
        error: error.message,
      });
    }
  }
}

module.exports = new HistoryController();
