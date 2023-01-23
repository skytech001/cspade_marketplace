import express from "express";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken, isAdmin, isAdminOrIsSeller, isAuth } from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

const userRouter = express.Router();
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});
// userRouter.get("/seed", async (req, res) => {
//   // await User.remove({});
//   const createdUsers = new User({
//     name: "Abbey",
//     email: "admin1@example.com",
//     password: "1234",
//     isAdmin: true,
//   });
//   createdUsers.save();
//   res.send({ createdUsers });
// });

userRouter.get(
  "/top-sellers",
  expressAsyncHandler(async (req, res) => {
    //sort(seller: -1) means sort sellers in decending order.
    const topSellers = await User.find({ isSeller: true })
      .sort({ "seller.rating": -1 })
      .limit(3);
    res.send(topSellers);
  })
);

userRouter.post("/signin", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (user) {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      res.send({
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isSeller: user.isSeller,
        token: generateToken(user),
      });

      return;
    }
  }
  res.status(401).send({ message: "Invallid email or password" });
});

userRouter.post(
  "/register",
  expressAsyncHandler(async (req, res, next) => {
    const options = {
      upload_preset: "product_images",
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };
    const file = req.body.sellerLogo;
    const logo = await cloudinary.uploader.upload(file, options);

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      isSeller: req.body.sellerName ? true : false,
      seller: req.body.sellerName
        ? {
            name: req.body.sellerName,
            logo: logo.url,
            description: req.body.sellerDescription,
          }
        : "",
    });

    const createdUser = await user.save();
    res.send({
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      isAdmin: createdUser.isAdmin,
      isSeller: createdUser.isSeller,
      token: generateToken(createdUser),
    });
  })
);

userRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

userRouter.put(
  "/profile",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const options = {
      upload_preset: "product_images",
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };
    const file = req.body.sellerLogo;
    const logo = await cloudinary.uploader.upload(file, options);
    console.log("hello");
    console.log(logo.url);
    console.log("hello");
    const user = await User.findById(req.body.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (user.isSeller) {
        user.seller.name = req.body.sellerName || user.seller.name;
        user.seller.logo = logo.url || user.seller.logo;
        user.seller.description =
          req.body.sellerDescription || user.seller.description;
      }
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
    }
    const updatedUser = await user.save();

    res.send({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      isSeller: updatedUser.isSeller,
      token: generateToken(updatedUser),
    });
  })
);

// get all users
userRouter.get(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({});
    res.send(users);
  })
);

userRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.email === "admin@example.com") {
        res.status(400).send({ message: "Can Not Delete Admin User." });
        return;
      }
      await user.remove();
      res.send({ message: "User Deleted Successfuly" });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

userRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isSeller = req.body.isSeller || user.isSeller;
      user.isAdmin = req.body.isAdmin || user.isAdmin;

      const updatedUser = await user.save();
      res.send({ message: "User Updated" });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

export default userRouter;
