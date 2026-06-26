require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const path = require("path");

const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
  })
);

app.use((req, res, next) => {
  const cart = req.session.cart || [];
  res.locals.cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  next();
});

app.use("/", productRoutes);
app.use("/cart", cartRoutes);

app.use((req, res) => {
  res.status(404).render("404", { title: "Không tìm thấy trang" });
});

app.listen(PORT, () => {
  console.log(`frontend chạy port http://localhost:${PORT}`);
});
