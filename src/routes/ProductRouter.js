const express = require("express");
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const { authMiddleWare, authUserMiddleWare } = require("../middleware/authMiddleware");

router.post("/create", ProductController.createProduct);
router.put("/update/:id", authMiddleWare, ProductController.updateProduct);
router.get("/get-details/:id", ProductController.getDetailsProduct);
router.delete("/delete-product/:id", authMiddleWare, ProductController.deleteProduct);
router.get("/getAll", ProductController.getAllProduct);
router.post("/delete-many", authMiddleWare, ProductController.deleteMany);

module.exports = router;
