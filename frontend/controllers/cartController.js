const { productService } = require("./apiService");

const showCart = (req, res) => {
  const cart = req.session.cart || [];
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.render("cart/index", { title: "Giỏ hàng", cart, total });
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const data = await productService.getById(productId);

    if (!data.success) {
      return res.json({ success: false, message: "Sản phẩm không tồn tại" });
    }

    const product = data.data;
    if (!req.session.cart) req.session.cart = [];

    const existing = req.session.cart.find((i) => i._id === productId);
    if (existing) {
      existing.quantity += parseInt(quantity);
    } else {
      req.session.cart.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: parseInt(quantity),
      });
    }

    const cartCount = req.session.cart.reduce((sum, item) => sum + item.quantity, 0);
    res.json({ success: true, message: "Đã thêm vào giỏ hàng", cartCount });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi thêm vào giỏ hàng" });
  }
};

const updateCart = (req, res) => {
  const { productId, quantity } = req.body;
  if (!req.session.cart) return res.json({ success: false });

  const item = req.session.cart.find((i) => i._id === productId);
  if (item) {
    if (parseInt(quantity) <= 0) {
      req.session.cart = req.session.cart.filter((i) => i._id !== productId);
    } else {
      item.quantity = parseInt(quantity);
    }
  }

  const cart = req.session.cart;
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  res.json({ success: true, cart, total, cartCount });
};

const removeFromCart = (req, res) => {
  const { productId } = req.body;
  if (req.session.cart) {
    req.session.cart = req.session.cart.filter((i) => i._id !== productId);
  }
  const cart = req.session.cart || [];
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  res.json({ success: true, cart, total, cartCount });
};

const clearCart = (req, res) => {
  req.session.cart = [];
  res.redirect("/cart");
};

module.exports = { showCart, addToCart, updateCart, removeFromCart, clearCart };
