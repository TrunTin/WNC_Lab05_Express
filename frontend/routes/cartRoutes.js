const express = require("express");
const router = express.Router();
const { showCart, addToCart, updateCart, removeFromCart, clearCart } = require("../controllers/cartController");

router.get("/", showCart);
router.post("/add", addToCart);
router.post("/update", updateCart);
router.post("/remove", removeFromCart);
router.post("/clear", clearCart);

module.exports = router;
