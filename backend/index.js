require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api/products", productRoutes);

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Backend is running", timestamp: new Date() });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route không tồn tại" });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server backend đang chạy tại http://localhost:${PORT}`);
});
