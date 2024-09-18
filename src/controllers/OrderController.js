const OrderService = require("../services/OrderService");

const createOrder = async (req, res) => {
  try {
    const { paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone } =
      req.body;
    // Trường hợp thiếu 1 trường dữ liệu
    if (!paymentMethod || !itemsPrice || !shippingPrice || !totalPrice || !fullName || !address || !city || !phone) {
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

module.exports = {
    createOrder
};
