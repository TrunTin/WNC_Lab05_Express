const express = require("express");
const router = express.Router();
const { showProductList, showProductDetail } = require("../controllers/productController");

router.get("/", showProductList);
router.get("/products/:id", showProductDetail);

module.exports = router;
