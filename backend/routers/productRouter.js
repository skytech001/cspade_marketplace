import express from "express";
import expressAsyncHandler from "express-async-handler";
import { isAuth, isAdmin, isAdminOrIsSeller } from "../utils.js";
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

productRouter.get(
  "/category",
  expressAsyncHandler(async (req, res) => {
    const categorys = await Product.find().distinct("category");
    res.send(categorys);
  })
);

productRouter.get("/", async (req, res) => {
  const pageSize = 12;
  const page = Number(req.query.pageNumber) || 1;
  const seller = req.query.seller || "";
  const name = req.query.name || "";
  const category = req.query.category || "";
  const order = req.query.order || "";
  const min =
    req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
  const max =
    req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;
  const rating =
    req.query.rating && Number(req.query.rating) !== 0
      ? Number(req.query.rating)
      : 0;

  const nameFilter = name ? { name: { $regex: name, $options: "i" } } : {};
  const sellerFilter = seller ? { seller } : {};
  const categoryFilter = category ? { category } : {};
  const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
  const ratingFilter = rating ? { rating: { $gte: rating } } : {};
  const sortOrder =
    order === "lowest"
      ? { price: 1 }
      : order === "highest"
      ? { price: -1 }
      : order === "toprated"
      ? { rating: -1 }
      : { _id: -1 };
  const count = await Product.count({
    ...sellerFilter,
    ...nameFilter,
    ...categoryFilter,
    ...priceFilter,
    ...ratingFilter,
  });

  const products = await Product.find({
    ...sellerFilter,
    ...nameFilter,
    ...categoryFilter,
    ...priceFilter,
    ...ratingFilter,
  })
    .populate("seller", "seller.name seller.logo")
    .sort(sortOrder)
    .skip(pageSize * (page - 1))
    .limit(pageSize);

  res.send({ products, page, pages: Math.ceil(count / pageSize) });
});

// productRouter.get("/seed", async (req, res) => {
//   const createdProducts = await Product.insertMany(data.products);
//   res.send({ createdProducts });
// });

productRouter.get("/:id", async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id }).populate(
    "seller",
    "seller.name seller.logo seller.rating seller.numReviews"
  );
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
  isAdminOrIsSeller,
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
        seller: req.user.id,
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
  isAdminOrIsSeller,
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

productRouter.post(
  "/:id/reviews",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      if (product.reviews.find((x) => x.name === req.user.name)) {
        return res.status(400).send({
          message: "You already submitted a review for this product.",
        });
      }
      const review = {
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
      const updatedProduct = await product.save();
      res.status(201).send({
        message: "Review Successfully Created",
        review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
      });
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);

export default productRouter;
