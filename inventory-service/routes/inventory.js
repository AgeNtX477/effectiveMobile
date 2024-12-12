const Router = require('express');

const router = new Router();
const inventoryController = require('../controllers/controller.inventory');

router.post('/product', inventoryController.postProduct);
router.post('/inventory', inventoryController.postInventory);
router.put('/inventory/increase', inventoryController.increaseInventory);
router.put('/inventory/decrease', inventoryController.decreaseInventory);
router.get('/inventory', inventoryController.getInventory);
router.get('/product/name/:name', inventoryController.getProductByName);
router.get('/product/plu/:plu', inventoryController.getProductByPlu);

module.exports = router;
