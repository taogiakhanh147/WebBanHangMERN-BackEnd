const UserService = require("../services/UserService");
const JwtService = require("../services/JwtService");

const createUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone } = req.body;
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isCheckEmail = reg.test(email);

    // Trường hợp thiếu 1 trường dữ liệu
    if (!email || !password || !confirmPassword ) {
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
    if (!email || !password) {
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

    const response = await UserService.loginUser(req.body);
    const {refresh_token, ...newReponse} = response
    res.cookie("refresh_token", refresh_token, {
      HttpOnly: true,
      Secure: true,
    })
    return res.status(200).json(newReponse);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;
    if (!userId) {
      return res.status(200).json({
        status: "OK",
        message: "The userId is require",
      });
    }
    console.log("userId", userId);
    const ressponse = await UserService.updateUser(userId, data);
    return res.status(200).json(ressponse);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(200).json({
        status: "OK",
        message: "The userId is require",
      });
    }
    console.log("userId", userId);
    const ressponse = await UserService.deleteUser(userId);
    return res.status(200).json(ressponse);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    const ressponse = await UserService.getAllUser();
    return res.status(200).json(ressponse);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getDetailsUser = async (req, res) => {
  try {
    const userId = req.params.id
    if (!userId) {
      return res.status(200).json({
        status: "OK",
        message: "The userId is require",
      })
    }
    const ressponse = await UserService.getDetailsUser(userId);
    return res.status(200).json(ressponse);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refresh_token
    if (!token) {
      return res.status(200).json({
        status: "ERR",
        message: "The token is require",
      })
    }
    
    const ressponse = await JwtService.refreshTokenJwtService(token);
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
  updateUser,
  deleteUser,
  getAllUser,
  getDetailsUser,
  refreshToken
};
