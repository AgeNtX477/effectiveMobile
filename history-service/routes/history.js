const Router = require('express');

const router = new Router();
const historyController = require('../controllers/controller.history');

router.post('/events', historyController.postEvent);
router.get('/history', historyController.getFilteredEvents);

module.exports = router;
