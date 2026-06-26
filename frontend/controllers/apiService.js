const axios = require("axios");

const API_BASE_URL = process.env.API_BASE_URL

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

const productService = {
  getAll: async (params = {}) => {
    const res = await api.get("/products", { params });
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },
};

module.exports = { productService };
