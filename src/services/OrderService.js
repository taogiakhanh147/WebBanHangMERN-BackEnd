const Order = require("../models/OrderProduct");
const Product = require("../models/ProductModel");

const createOrder = (newOrder) => {
  
  return new Promise(async (resolve, reject) => {
    const {orderItems, paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, user } = newOrder;
    try {
      const promises = orderItems.map(async (order) => {
        const productData = await Product.findOneAndUpdate(
          {
            _id: order.product,
            countInStock: {$gte: order.amount}
          },
          {
            $inc: {
              countInStock: -order.amount,
              selled: +order.amount
            }
          },
          {new: true},
        )
        if(productData) {
          const createOrder = await Order.create({
            orderItems,
            shippingAddress: {
              fullName, 
              address, 
              city,
              phone 
            },
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice,
            user
          });
          if (createOrder) {
            return{
              status: "OK",
              message: "SUCCESS",
            };
          }
        } else {
          return{
            status: "OK",
            message: "ERR",
            id: order.product,
          };
        }
      })
      const results = await Promise.all(promises)
      const newData = results && results.filter((item) => item.id)
      if(newData.length) {
        resolve({
          status: 'ERR',
          message: `Sản phẩm với id${newData.join(',')} không đủ hàng `
        })
      } 
        resolve({
          status: 'OK',
          message: `success`
        })
    } catch (e) {
      // reject(e);
    }
  });
};

const getOrderDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findOne({
        user: id,
      });
      if (order === null) {
        resolve({
          status: "ERR",
          message: "order is not exist",
        });
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
    createOrder,
    getOrderDetails
};
