import express from "express";
import mongoose from "mongoose";
import path from "path";
import cors from "cors";
import userRouter from "./routers/userRouter.js";
import dotenv from "dotenv";
import productRouter from "./routers/productRouter.js";
import orderRouter from "./routers/orderRouter.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

mongoose
  // process.env.MONGODB_URL ||
  .connect("mongodb://localhost/centerspade", {
    useNewUrlParser: true,
  })
  .then(() => console.log("db check"))
  .catch((error) => console.log(error));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/frontend/build")));

// app.get("/", (req, res) => {
//   res.send("server is ready");
// });

app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/orders", orderRouter);
app.get("/keys/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || "sb");
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/frontend/build/index.html"));
});

app.listen(PORT, () => {
  console.log(`serve at http://localhost:${PORT}`);
});
