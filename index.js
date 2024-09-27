import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
app.use(cors());

// Middleware to parse JSON data
app.use(bodyParser.json());

// Middleware to parse URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));



// socket
import path from "path";
import http from "http";
const server = http.createServer(app);
import { Server } from "socket.io";
const io = new Server(server);


// route import
import Auth from "./route/auth.js";
import Product from "./route/product.js";

// app.use('/auth/',Auth)
const port = process.env.PORT;


app.use("/auth/", Auth);
app.use("/product/", Product);

app.listen(port, () => {
  console.log(`server up with http://localhost:${port}`);
});

