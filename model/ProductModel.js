import mongoose from "mongoose";
import "../database/config.js";

const ProductSchema = new mongoose.Schema(
  {
    user_id: {
      required: true,
      type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    product_name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,  // Change type to Number
      required: true,
      min: [0, 'Price must be a positive number'],  // Add validation
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const ProductModel = mongoose.model("Product", ProductSchema);

export default ProductModel;
