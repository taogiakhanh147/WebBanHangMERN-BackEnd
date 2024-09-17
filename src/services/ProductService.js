const Product = require("../models/ProductModel");

const createProduct = (newProduct) => {
  return new Promise(async (resolve, reject) => {
    const { name, image, type, countInStock, price, rating, description, discount } =
      newProduct;

    try {
      const checkProduct = await Product.findOne({
        name,
      });

      if (checkProduct != null) {
        resolve({
          status: "OK",
          message: "Name of product is already",
        });
      }
      const newProduct = await Product.create({
        name,
        image,
        type,
        countInStock,
        price,
        rating,
        description,
        discount
      });
      if (createProduct) {
        resolve({
          status: "OK",
          message: "Success",
          data: newProduct,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateProduct = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        _id: id,
      });

      if (!checkProduct) {
        resolve({
          status: "ERR",
          message: "Product is not exist",
        });
      }

      const updatedProduct = await Product.findByIdAndUpdate(id, data, {
        new: true,
      });

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updatedProduct,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        _id: id,
      });
      if (checkProduct === null) {
        resolve({
          status: "ERR",
          message: "Product is not exist",
        });
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: checkProduct,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        _id: id,
      });
      if (checkProduct === null) {
        resolve({
          status: "ERR",
          message: "Product is not exist",
        });
      }
      await Product.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "SUCCESS",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteManyProduct = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Product.deleteMany({_id: ids});
      resolve({
        status: "OK",
        message: "SUCCESS",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllProduct = (limit, page, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalProduct = await Product.countDocuments();
      let query = {};
      
      if (filter) {
        const [label, searchTerm] = filter;
        query[label] = { '$regex': new RegExp(searchTerm, 'i') }; // Sử dụng biểu thức chính quy không phân biệt chữ hoa và chữ thường
      }

      let allProduct;
      
      if (sort) {
        const [sortOrder, sortField] = sort;
        allProduct = await Product.find(query).limit(limit).skip(page * limit).sort({ [sortField]: sortOrder });
      } else {
        allProduct = await Product.find(query).limit(limit).skip(page * limit);
      }

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: allProduct,
        total: totalProduct,
        currenPage: page + 1,
        totalPage: Math.ceil(totalProduct / limit)
      });
      
    } catch (e) {
      reject(e);
    }
  });
};

const getAllType = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allType = await Product.distinct('type');
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: allType
      });
      
    } catch (e) {
      reject(e);
    }
  });
};


module.exports = {
  createProduct,
  updateProduct,
  getDetailProduct,
  deleteProduct,
  getAllProduct,
  deleteManyProduct,
  getAllType
};
