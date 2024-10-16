const OrderService = require("../services/OrderService");

const createOrder = async (req, res) => {
  try {
    const { paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone } =
      req.body;
    // Trường hợp thiếu 1 trường dữ liệu
    if (!paymentMethod || !itemsPrice || shippingPrice === null || !totalPrice || !fullName || !address || !city || !phone) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const ressponse = await OrderService.createOrder(req.body);
    return res.status(200).json(ressponse);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllOrderDetails = async (req, res) => {
  try {
      const userId = req.params.id
      if (!userId) {
          return res.status(200).json({
              status: 'ERR',
              message: 'The userId is required'
          })
      }
      const response = await OrderService.getAllOrderDetails(userId)
      return res.status(200).json(response)
  } catch (e) {
      return res.status(404).json({
          message: e
      })
  }
}

const getDetailsOrder = async (req, res) => {
  try {
      const orderId = req.params.id
      if (!orderId) {
          return res.status(200).json({
              status: 'ERR',
              message: 'The userId is required'
          })
      }
      const response = await OrderService.getOrderDetails(orderId)
      return res.status(200).json(response)
  } catch (e) {
      return res.status(404).json({
          message: e
      })
  }
}

const getDetailsOrderAdmin = async(req,res) => {
  try {
    const {orderId} = req.body
    if(!orderId) {
      return res.status(400).json({
        status: "ERR",
        message: "OrderId not find"
      })
    }
    const response = await OrderService.getDetailsOrderAdmin(orderId)
    return res.status(200).json(response)
  } catch(e) {
    return res.status(404).json({
      message: e
    })
  }
}

const cancelOrderDetails = async (req, res) => {
  try {
      const orderId = req.params.id
      const data = req.body
      console.log(data)
      if (!orderId) {
          return res.status(200).json({
              status: 'ERR',
              message: 'The userId is required'
          })
      }
      const response = await OrderService.cancelOrderDetails(orderId, data)
      return res.status(200).json(response)
  } catch (e) {
      return res.status(404).json({
          message: e
      })
  }
}

const getAllOrder = async (req, res) => {
  try {
      const data = await OrderService.getAllOrder()
      return res.status(200).json(data)
  } catch (e) {
      // console.log(e)
      return res.status(404).json({
          message: e
      })
  }
}

const deleteOrderAdmin = async (req, res) => {
  try {
    const orderId = req.params.id
    if (!orderId) {
      return res.status(200).json({
        status: "ERR",
        message: "orderId is require"
      })
    }
    const ressponse = await OrderService.deleteOrderAdmin(orderId)
    return res.status(200).json(ressponse)
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteMany = async (req, res) => {
  try {
    const ids = req.body.ids
    if (!ids) {
      return res.status(200).json({
        status: "ERR",
        message: "ids is require"
      })
    }
    const ressponse = await OrderService.deleteManyOrder(ids)
    return res.status(200).json(ressponse)
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
    createOrder,
    getAllOrderDetails,
    getDetailsOrder,
    cancelOrderDetails,
    getAllOrder,
    getDetailsOrderAdmin,
    deleteOrderAdmin,
    deleteMany
};
