const axios = require('axios');
const db = require('./db');

async function sendEvent(action, plu, shopId, quantityShell, quantityOrder, httpInfo) {
  const event = {
    action,
    plu,
    shopId,
    quantityShell,
    quantityOrder,
    timestamp: new Date().toISOString(),
    httpInfo,
  };

  try {
    const response = await axios.post('http://localhost:3001/events', event);
    return response;
  } catch (error) {
    console.error('Ошибка при отправке события:', error);
    return false;
  }
}

async function checkExistence(query, params, errorMessage) {
  const result = await db.query(query, params);
  if (result.rows.length === 0) {
    throw new Error(errorMessage);
  }
}

function getHttpRequest(req) {
  return `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`;
}

module.exports = { sendEvent, checkExistence, getHttpRequest };
