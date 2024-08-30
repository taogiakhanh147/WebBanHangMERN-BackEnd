const UserService = require("../services/UserService");

const createUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone } = req.body;
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isCheckEmail = reg.test(email);

    // Trường hợp thiếu 1 trường dữ liệu
    if (!name || !email || !password || !confirmPassword || !phone) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }

    // Trường hợp Email không đúng định dạng
    else if (!isCheckEmail) {
      return res.status(200).json({
        status: "ERR",
        message: "Email invalid",
      });
    }

    // Trường hợp password không trùng khớp với confirmPassword
    else if (password != confirmPassword) {
      return res.status(200).json({
        status: "ERR",
        message: "The password is equal confirmpassword",
      });
    }

    const ressponse = await UserService.createUser(req.body);
    return res.status(200).json(ressponse);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone } = req.body;
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isCheckEmail = reg.test(email);

    // Trường hợp thiếu 1 trường dữ liệu
    if (!name || !email || !password || !confirmPassword || !phone) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }

    // Trường hợp Email không đúng định dạng
    else if (!isCheckEmail) {
      return res.status(200).json({
        status: "ERR",
        message: "Email invalid",
      });
    }

    // Trường hợp password không trùng khớp với confirmPassword
    else if (password != confirmPassword) {
      return res.status(200).json({
        status: "ERR",
        message: "The password is equal confirmpassword",
      });
    }

    const ressponse = await UserService.loginUser(req.body);
    return res.status(200).json(ressponse);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createUser,
  loginUser,
};
