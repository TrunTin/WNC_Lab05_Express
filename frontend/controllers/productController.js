const { productService } = require("./apiService");

const showProductList = async (req, res) => {
  try {
    const { search, category, page = 1 } = req.query;
    const data = await productService.getAll({ search, category, page, limit: 12 });

    res.render("products/index", {
      title: "Cửa hàng",
      products: data.data || [],
      total: data.total || 0,
      currentPage: data.page || 1,
      totalPages: data.totalPages || 1,
      search: search || "",
      category: category || "",
    });
  } catch (error) {
    res.render("products/index", {
      title: "Cửa hàng",
      products: [],
      total: 0,
      currentPage: 1,
      totalPages: 1,
      search: "",
      category: "",
      error: "Không thể tải danh sách sản phẩm. Vui lòng thử lại.",
    });
  }
};

const showProductDetail = async (req, res) => {
  try {
    const data = await productService.getById(req.params.id);
    if (!data.success) {
      return res.redirect("/");
    }
    res.render("products/detail", {
      title: data.data.name,
      product: data.data,
    });
  } catch (error) {
    res.redirect("/");
  }
};

module.exports = { showProductList, showProductDetail };
