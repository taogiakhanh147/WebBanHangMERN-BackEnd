const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { generalAccessToken, generalRefreshToken } = require("./JwtService");
const { all } = require("../routes/UserRouter");

const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, password, confirmPassword, phone } = newUser;
    try {
      const checkUser = await User.findOne({
        email,
      });
      if (checkUser != null) {
        resolve({
          status: "ERR",
          message: "Email is already",
        });
      }
      const hash = bcrypt.hashSync(password, 10);
      const createUser = await User.create({
        name,
        email,
        password: hash,
        phone,
      });
      if (createUser) {
        resolve({
          status: "OK",
          message: "Success",
          data: createUser,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const loginUser = (userLogin) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = userLogin;
    try {
      const checkUser = await User.findOne({
        email,
      });

      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "Email is not exist",
        });
      }

      const comparePassword = bcrypt.compareSync(password, checkUser.password);

      if (!comparePassword) {
        resolve({
          status: "ERR",
          message: "The password or user is incorrect",
        });
      }

      const access_token = await generalAccessToken({
        id: checkUser.id,
        isAdmin: checkUser.isAdmin
      })

      const refresh_token = await generalRefreshToken({
        id: checkUser.id,
        isAdmin: checkUser.isAdmin
      })

      resolve({
        status: "OK",
        message: "Success",
        access_token,
        refresh_token
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateUser = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
         _id: id 
        });

      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "Email is not exist",
        });
      }

      const updatedUser = await User.findByIdAndUpdate(id, data, {new: true})

      resolve({
        status: "OK",
        message: "Success",
        data: updatedUser
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
         _id: id 
        });

      if (checkUser === null) {
        resolve({
          status: "OK",
          message: "Email is not exist",
        });
      }

      await User.findByIdAndDelete(id)

      resolve({
        status: "OK",
        message: "Delete user success"
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteManyUser = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await User.deleteMany({_id: ids});
      resolve({
        status: "OK",
        message: "SUCCESS",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allUser = await User.find()

      resolve({
        status: "OK",
        message: "Success",
        data: allUser
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailsUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
         _id: id 
        });
      if (checkUser === null) {
        resolve({
          status: "OK",
          message: "Email is not exist",
        });
      }

      resolve({
        status: "OK",
        message: "Success",
        data: checkUser
      });
    } catch (e) {
      reject(e);
    }
  });
};



module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailsUser,
  deleteManyUser
};
