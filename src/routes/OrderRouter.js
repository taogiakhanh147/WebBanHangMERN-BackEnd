const express = require("express");
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const { authUserMiddleWare, authMiddleWare } = require("../middleware/authMiddleware");

router.post("/create", OrderController.createOrder);
router.get('/get-all-order/:id', OrderController.getAllOrderDetails)
router.get('/get-details-order/:id', OrderController.getDetailsOrder)
router.delete('/cancel-order/:id', OrderController.cancelOrderDetails)
router.get('/get-all-order',authMiddleWare, OrderController.getAllOrder)
router.post('/get-details-order-admin', OrderController.getDetailsOrderAdmin)
router.delete("/delete-order-admin/:id", OrderController.deleteOrderAdmin);
router.post("/delete-many", OrderController.deleteMany);

module.exports = router;
