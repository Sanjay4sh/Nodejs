import { config } from "dotenv";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


export const AuthMid = (req, res, next) => {

  try {
    const token = req.header("Authorization");
    if (!token) return res.status(401).send({ message: "Unauthorized Access", 'success': false });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send({ message: "Unauthorized Access", 'success': false });
  }

};


