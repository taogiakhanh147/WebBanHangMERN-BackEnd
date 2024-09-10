const Product = require("../models/ProductModel");
const ProductService = require("../services/ProductService");

const createProduct = async (req, res) => {
  try {
    const { name, image, type, price, countInStock, rating, description } =
      req.body;

    // // Trường hợp thiếu 1 trường dữ liệu
    if (!name || !image || !type || !price || !countInStock || !rating) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const ressponse = await ProductService.createProduct(req.body);
    return res.status(200).json(ressponse);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const data = req.body;

    if (!productId) {
      return res.status(200).json({
        status: "ERR",
        message: "productId is require",
      });
    }
    const ressponse = await ProductService.updateProduct(productId, data);
    return res.status(200).json(ressponse);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getDetailsProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(200).json({
        status: "ERR",
        message: "ProductId is require",
      });
    }
    const ressponse = await ProductService.getDetailProduct(productId);
    return res.status(200).json(ressponse);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id
    if (!productId) {
      return res.status(200).json({
        status: "ERR",
        message: "productId is require"
      })
    }
    const ressponse = await ProductService.deleteProduct(productId)
    return res.status(200).json(ressponse)
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllProduct = async (req, res) => {
  try{
    const {limit, page, sort, filter} = req.query
    const ressponse = await ProductService.getAllProduct(Number(limit) || 6, Number(page) || 0, sort, filter)
    return res.status(200).json(ressponse)
  }
  catch(e) {
    return res.status(404).json({
      message: e
    })
  }
}

module.exports = {
  createProduct,
  updateProduct,
  getDetailsProduct,
  deleteProduct,
  getAllProduct
};
