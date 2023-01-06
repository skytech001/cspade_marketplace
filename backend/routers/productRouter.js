import express from "express";
import expressAsyncHandler from "express-async-handler";
import { isAuth, isAdmin } from "../utils.js";
import Product from "../models/productModel.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

const productRouter = express.Router();
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

productRouter.get("/", async (req, res) => {
  // the root here refers to the products because this is a router to product root, the app.use('/products) in the  server points to it.
  const products = await Product.find({});
  res.send(products);
});

// productRouter.get("/seed", async (req, res) => {  used to upload multiple products
//   const createdProducts = await Product.insertMany(data.products);
//   res.send({ createdProducts });
// });

productRouter.get("/:id", async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id });
  if (product) {
    res.send(product);
    return;
  } else {
    res.status(404).send({ message: "Product Not Found" });
  }
});

productRouter.post(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const options = {
      upload_preset: "product_images",
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };
    const file = req.body.productImage;
    // Upload the image
    let images = [];
    for (let i = 0; i < file.length; i++) {
      try {
        const data = await cloudinary.uploader.upload(file[i], options);
        images.push(data.url);
      } catch (error) {
        console.error(error);
      }
    }

    if (images) {
      const product = new Product({
        name: req.body.name,
        image: images,
        price: req.body.price,
        category: req.body.category,
        rating: 0,
        numReviews: 0,
        description: req.body.description,
        brand: req.body.brand,
        countInStock: req.body.countInStock,
      });
      const createdProduct = await product.save();
      res.send({ message: "Product Created", product: createdProduct });
    }
  })
);

productRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      const OldImgSet = req.body.productImage;
      const images = OldImgSet.filter((item) => item.length < 200);
      const unprocessedImg = OldImgSet.filter((item) => item.length > 200);

      if (unprocessedImg) {
        const options = {
          upload_preset: "product_images",
          use_filename: true,
          unique_filename: false,
          overwrite: true,
        };
        for (let i = 0; i < unprocessedImg.length; i++) {
          try {
            const data = await cloudinary.uploader.upload(
              unprocessedImg[i],
              options
            );
            images.push(data.url);
          } catch (error) {
            console.error(error);
          }
        }
      }

      product.name = req.body.name;
      product.price = req.body.price;
      product.image = images;
      product.category = req.body.category;
      product.countInStock = req.body.countInStock;
      product.description = req.body.description;
      product.brand = req.body.brand;

      const updatedProduct = await product.save();

      res.send({
        message: "Success!!! Product Updated",
        product: updatedProduct,
      });
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);

productRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.remove();
      res.send({ message: "Product Deleted" });
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);

export default productRouter;
