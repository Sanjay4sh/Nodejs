import ProductModel from '../model/ProductModel.js';
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
dotenv.config();


export const AddProduct = async (req, res) => {

  try {
    const token = req.header("Authorization");
    const AuthData = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.body.user_id = AuthData.user_id;
    const product = new ProductModel(req.body)
    const result = await product.save();

    res.status(200).send({ message: "product saved successfully" })

  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      res.status(400).send({ message: "Validation failed", errors });
    } else {
      res.status(500).send({ message: "Internal Server Error" });
    }

  }

}

export const GetProduct = async (req, resp) => {

  const result = await ProductModel.aggregate(
    [
      {
        $lookup:
        {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'users'
        }
      }
    ]
  )

  if (result) {
    resp.status(200).send({ message: "product listing", data: result });
  } else {
    resp.status(404).send({ message: " failed" })
  }
}



export const UploadImage = async (req, res) => {
  const uploadDir = path.join('./uploads'); // Set the uploads directory
  console.log(`Uploading ${uploadDir}`)
  // Ensure the 'uploads' directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }); // Create the directory if it doesn't exist
  }

  // Use formidable to handle form data, including files
  const form = formidable({
    uploadDir: uploadDir,
    keepExtensions: true, // Preserve file extensions
  });

  // Parse the incoming request with the formidable instance
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).send({ error: 'Image upload failed', details: err });
    }

    const file = files.image;
    if (!file) {
      return res.status(400).send({ error: 'No file uploaded' });
    }

    // Check if the file is an array and get the correct filepath and original filename
    const uploadedFile = Array.isArray(file) ? file[0] : file;
    const filePath = uploadedFile.filepath;
    const originalFilename = uploadedFile.originalFilename || `${Date.now()}`;

    // Get the file extension
    const extension = path.extname(originalFilename) || '.jpg'; // Default to .jpg if no extension found
    const newFileName = `${path.parse(originalFilename).name}_${Date.now()}${extension}`; // Create new filename with timestamp and extension
    const newPath = path.join(uploadDir, newFileName); // Create the new path for the file

    // Move the file from the temporary location to the final upload directory
    fs.rename(filePath, newPath, (err) => {
      if (err) {
        return res.status(500).send({ error: 'Failed to move the image', details: err });
      }

      // Return the image URL as a response
      const imageUrl = `/uploads/${newFileName}`; // Adjust the image URL as necessary
      return res.status(200).send({ image_name: imageUrl });
    });
  });
};

