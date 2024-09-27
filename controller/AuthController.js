import UserModel from "../model/UserModel.js";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../model/Common.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";


export const Login = async (req, resp) => {
  const jwtSecretKey = process.env.JWT_SECRET_KEY;
  var data = {};
  console.log('123465')
  try {

    bcrypt.genSalt(12, function (err, salt) {
      bcrypt.hash("132165465", salt, function (err, hash) {
        console.log(hash)
      });
    });

    const user = await UserModel.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    if (!user) {
      resp.status(404).send({ message: "Invalid Credetials" });

    }
    const jwtdata = {
      date: Date(),
      user_id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    };
    var token = jwt.sign(jwtdata, jwtSecretKey, { expiresIn: "10m" });
    var update = await UserModel.updateOne({ _id: user._id }, { token: token });
    data = await UserModel.findOne({ _id: user._id });
    console.log(data);

    resp.status(200).send({ data: data, message: "Login success" });
  } catch (error) {
    resp.status(500).send({ message: "something went wrong" });
  }
};

export const Register = async (req, resp) => {
  var msg = "";
  var data = {};
  var status = 200;
  try {
    const jwtSecretKey = process.env.JWT_SECRET_KEY;

    const emailExist = await UserModel.findOne({ email: req.body.email });
    console.log(req.body)
    if (emailExist) {
      throw "Email already exists .please try another email";
    }

    const user = await UserModel.create({
      email: req.body.email,
      password: req.body.password,
      username: req.body.username,
      token: "",
    });

    // console.log(user);
    const jwtdata = {
      date: Date(),
      user_id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    };

    var token = jwt.sign(jwtdata, jwtSecretKey);
    await UserModel.updateOne({ _id: user._id }, { token: token });

    data = await UserModel.findOne({ _id: user._id });
    msg = "User saved successfully";
    status = 200;
  } catch (error) {
    msg = error;
  }

  return resp.status(status).send({ data: data, message: msg });
};

export const update_profile = async (req, resp) => {
  try {
    const result = await UserModel.updateOne(
      { _id: req.body._id },
      { username: req.body.username }
    );
    const user = await UserModel.findOne({ _id: req.body._id });
    resp.status(200).send(user);
  } catch (error) {
    resp.status(404).send({ message: error.message });
  }
};

export const GetUser = async (req, resp) => {

  const token = req.header("Authorization");
  const AuthData = jwt.verify(token, process.env.JWT_SECRET_KEY);
  console.log(AuthData);
  const data = await UserModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(AuthData.user_id)
      }
    },
    {
      $lookup: {
        from: 'products', // The collection to join with
        localField: '_id', // The field in 'users' collection that you want to join on
        foreignField: 'user_id', // The field in 'products' collection that references the user
        as: 'products' // The name of the resulting array
      }
    },
    {
      $project: {
        password: 0, // Exclude the password field
        __v: 0, // Exclude the version field
        updatedAt: 0 // Exclude updatedAt
      }
    }
  ]);



  ApiResponse(resp, true, "User Details", 200, data);

  // resp.status(200).send({ message: "user details", data: data });
};

export const Logout = async (req, resp) => {

  const authHeader = req.header("Authorization");
  jwt.sign(authHeader, "", { expiresIn: 1 }, (logout, err) => {
    console.log(logout)
    if (logout) {
      resp.status(200).send({ msg: 'You have been Logged Out' });
    } else {
      resp.status(400).send({ msg: 'Error' });
    }
  });

}
