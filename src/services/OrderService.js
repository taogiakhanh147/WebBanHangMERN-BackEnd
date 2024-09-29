const Order = require("../models/OrderProduct");
const Product = require("../models/ProductModel");
const EmailService = require("../services/EmailService");


const createOrder = (newOrder) => {
  return new Promise(async (resolve, reject) => {
    const {
      orderItems,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      fullName,
      address,
      city,
      phone,
      user,
      isPaid,
      paidAt,
      email,
    } = newOrder;
    try {
      // Tạo mảng promises để cập nhật số lượng hàng trong kho
      const promises = orderItems.map(async (order) => {
        const productData = await Product.findOneAndUpdate(
          {
            _id: order.product,
            countInStock: { $gte: order.amount },
          },
          {
            $inc: {
              countInStock: -order.amount,
              selled: +order.amount,
            },
          },
          { new: true }
        );

        // Nếu không tìm thấy dữ liệu sản phẩm hoặc hàng tồn kho không đủ
        if (!productData) {
          return {
            status: "ERR",
            message: `Sản phẩm với ID ${order.product} không đủ hàng`,
            id: order.product,
          };
        }
      });

      // Chờ tất cả các sản phẩm được cập nhật
      const results = await Promise.all(promises);

      // Kiểm tra nếu có sản phẩm nào không đủ hàng
      const newData =
        results && results.filter((item) => item?.status === "ERR");
      if (newData.length) {
        return resolve({
          status: "ERR",
          message: `Sản phẩm với id ${newData
            .map((item) => item.id)
            .join(", ")} không đủ hàng`,
        });
      }

      // Nếu tất cả các sản phẩm đều được cập nhật thành công, tạo đơn hàng
      const createdOrder = await Order.create({
        orderItems,
        shippingAddress: {
          fullName,
          address,
          city,
          phone,
        },
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
        user: user,
        isPaid,
        paidAt,
      });

      // Gửi email xác nhận nếu đơn hàng được tạo thành công
      if (createdOrder) {
        await EmailService.sendEmailCreateOrder(email, orderItems);
        return resolve({
          status: "OK",
          message: "Đặt hàng thành công",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllOrderDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.find({
        user: id,
      });
      if (order === null) {
        resolve({
          status: "ERR",
          message: "The order is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "SUCESSS",
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getOrderDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findById({
        _id: id,
      });
      if (order === null) {
        resolve({
          status: "ERR",
          message: "The order is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "SUCESSS",
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const cancelOrderDetails = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let order = [];
      const promises = data.map(async (order) => {
        const productData = await Product.findOneAndUpdate(
          {
            _id: order.product,
            selled: { $gte: order.amount },
          },
          {
            $inc: {
              countInStock: +order.amount,
              selled: -order.amount,
            },
          },
          { new: true }
        );
        if (!productData) {
          return {
            status: "ERR",
            message: `Sản phẩm với id ${orderItem.product} không tồn tại`,
          };
        }
      });

      const results = await Promise.all(promises);

      const errorProducts = results.filter((result) => result?.status === 'ERR');
      if (errorProducts.length > 0) {
        resolve({
          status: 'ERR',
          message: `Có sản phẩm không tồn tại: ${errorProducts.map((p) => p.message).join(', ')}`,
        });
      }

      order = await Order.findByIdAndDelete(id);

      resolve({
        status: "OK",
        message: "success",
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllOrder = () => {
  return new Promise(async (resolve, reject) => {
      try {
          const allOrder = await Order.find().sort({createdAt: -1, updatedAt: -1})
          resolve({
              status: 'OK',
              message: 'Success',
              data: allOrder
          })
      } catch (e) {
          reject(e)
      }
  })
}

const getDetailsOrderAdmin = (id) => {
  return new Promise( async (resolve, reject) => {
    try {
      const checkOrder = await Order.findOne({
        _id: id
      })
      if(!checkOrder) {
        resolve({
          status: "ERR",
          message: "Order is not exist"
        })
      }
      resolve ({
        status: "OK",
        message: "SUCCESS",
        data: checkOrder,
      })
    } catch(e) {
      reject(e)
    }
  })
}

module.exports = {
  createOrder,
  getAllOrderDetails,
  getOrderDetails,
  cancelOrderDetails,
  getAllOrder,
  getDetailsOrderAdmin
};
