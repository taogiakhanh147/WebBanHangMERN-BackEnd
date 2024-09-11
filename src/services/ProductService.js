const Product = require("../models/ProductModel");

const createProduct = (newProduct) => {
  return new Promise(async (resolve, reject) => {
    const { name, image, type, countInStock, price, rating, description } =
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
      const totalProduct = await Product.countDocuments()
      if(filter) {
        const label = filter[0]
        const allProductFilter = await Product.find({ [label]: {'$regex': filter[1]}}).limit(limit).skip(page * limit);
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: allProductFilter,
          total: totalProduct,
          currenPage: page + 1,
          totalPage: Math.ceil(totalProduct / limit)
        });
      }
      if(sort) {
        const objectSort = {}
        objectSort[sort[1]] = sort[0]
        const allProductSort = await Product.find().limit(limit).skip(page * limit).sort(objectSort);
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: allProductSort,
          total: totalProduct,
          currenPage: page + 1,
          totalPage: Math.ceil(totalProduct / limit)
        });
      }
      const allProduct = await Product.find().limit(limit).skip(page * limit);
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

module.exports = {
  createProduct,
  updateProduct,
  getDetailProduct,
  deleteProduct,
  getAllProduct,
  deleteManyProduct
};
