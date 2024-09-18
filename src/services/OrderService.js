const Order = require("../models/OrderProduct");
const { generalAccessToken, generalRefreshToken } = require("./JwtService");
const { all } = require("../routes/UserRouter");

const createOrder = (newOrder) => {
  return new Promise(async (resolve, reject) => {
    const {orderItems, paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, user } = newOrder;
    try {
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
        resolve({
          status: "OK",
          message: "Success",
          data: createOrder,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
    createOrder
};
