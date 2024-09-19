const Order = require("../models/OrderProduct");
const Product = require("../models/ProductModel");

const createOrder = (newOrder) => {
  return new Promise(async (resolve, reject) => {
    const { orderItems, paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, user } = newOrder;

    try {
      // Duyệt qua từng sản phẩm trong đơn hàng
      const orderResults = await Promise.all(orderItems.map(async (order) => {
        const productData = await Product.findOneAndUpdate(
          {
            _id: order.product,
            countInStock: { $gte: order.amount }
          },
          {
            $inc: {
              countInStock: -order.amount, // Giảm số lượng tồn kho
              selled: +order.amount         // Tăng số lượng đã bán
            }
          },
          { new: true } // Trả về document đã cập nhật
        );

        // Nếu sản phẩm tồn tại và cập nhật tồn kho thành công
        if (productData) {
          return { success: true };
        } else {
          // Trường hợp sản phẩm không đủ hàng
          return { success: false, id: order.product };
        }
      }));

      // Lọc ra những sản phẩm không đủ hàng
      const insufficientStockItems = orderResults.filter(result => !result.success);

      // Nếu có sản phẩm không đủ hàng
      if (insufficientStockItems.length > 0) {
        resolve({
          status: 'ERR',
          message: `Sản phẩm với id ${insufficientStockItems.map(item => item.id).join(', ')} không đủ hàng`
        });
      } else {
        // Nếu tất cả sản phẩm đều có đủ hàng, tiến hành tạo đơn hàng
        const createdOrder = await Order.create({
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

        // Trả về kết quả thành công khi tạo đơn hàng
        resolve({
          status: 'OK',
          message: 'SUCCESS'
        });
      }
    } catch (error) {
      // Bắt lỗi và trả về thông báo lỗi
      reject({
        status: 'ERR',
        message: 'Lỗi khi tạo đơn hàng',
        error
      });
    }
  });
};


const getAllOrderDetails = (id) => {
  return new Promise(async (resolve, reject) => {
      try {
          const order = await Order.find({
              user: id
          })
          if (order === null) {
              resolve({
                  status: 'ERR',
                  message: 'The order is not defined'
              })
          }

          resolve({
              status: 'OK',
              message: 'SUCESSS',
              data: order
          })
      } catch (e) {
          console.log('e', e)
          reject(e)
      }
  })
}

const getOrderDetails = (id) => {
  return new Promise(async (resolve, reject) => {
      try {
          const order = await Order.findById({
              _id: id
          })
          if (order === null) {
              resolve({
                  status: 'ERR',
                  message: 'The order is not defined'
              })
          }
          resolve({
              status: 'OK',
              message: 'SUCESSS',
              data: order
          })
      } catch (e) {
          console.log('e', e)
          reject(e)
      }
  })
}

const cancelOrderDetails = (id) => {
  return new Promise(async (resolve, reject) => {
      try {
          const order = await Order.findByIdAndDelete(id)
          if (order === null) {
              resolve({
                  status: 'ERR',
                  message: 'The order is not defined'
              })
          }
          resolve({
              status: 'OK',
              message: 'SUCESSS',
              data: order
          })
      } catch (e) {
          console.log('e', e)
          reject(e)
      }
  })
}

module.exports = {
    createOrder,
    getAllOrderDetails,
    getOrderDetails,
    cancelOrderDetails
};
