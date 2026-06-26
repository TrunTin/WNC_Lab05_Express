const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "CastError" && err.kind === "ObjectId") {
    return res.status(400).json({ success: false, message: "ID không hợp lệ" });
  }

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: messages.join(", ") });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Lỗi server nội bộ",
  });
};

module.exports = errorHandler;
