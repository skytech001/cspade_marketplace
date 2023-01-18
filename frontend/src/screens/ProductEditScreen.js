import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { getClickedProduct } from "../features/clickedProductSlice";
import "react-toastify/dist/ReactToastify.css";
import {
  createProduct,
  createProductReset,
  updateProduct,
} from "../features/productSlice";

const ProductEditScreen = () => {
  const { pathname } = useLocation();
  const sellerMode = pathname.indexOf("/seller") >= 0;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [productImage, setproductImage] = useState([]);

  const { clickedProd, loadingClicked, clickedError } = useSelector(
    (state) => state.clickedProductDetail
  );

  const { createLoading, createError, createSuccess, createdProduct } =
    useSelector((store) => store.products);

  const product = createdProduct.name ? createdProduct : clickedProd;
  const id = createdProduct._id ? createdProduct._id : params.id;

  useEffect(() => {
    if (id.length > 3) {
      if (!product || product._id !== id || createSuccess) {
        dispatch(getClickedProduct(id));
      } else {
        setName(product.name);
        setPrice(product.price);
        setCategory(product.category);
        setCountInStock(product.countInStock);
        setBrand(product.brand);
        setDescription(product.description);
        setproductImage(product.image);
      }
    }
    if (createdProduct.name) {
      if (sellerMode) {
        navigate(`/listofproduct/sellers`);
      } else {
        navigate(`/Listofproduct`);
      }
      dispatch(createProductReset());
    }
  }, [
    dispatch,
    id,
    navigate,
    clickedProd,
    createSuccess,
    product,
    createdProduct,
  ]);

  const productData = {
    name,
    price,
    category,
    countInStock,
    brand,
    description,
    productImage,
  };

  const submitHandler = (event) => {
    event.preventDefault();

    if (id.length < 2) {
      dispatch(createProduct(productData));
    } else {
      dispatch(updateProduct({ id, productData }));
    }
  };

  const uploadFileHandler = (event) => {
    if (productImage.length <= 4) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setproductImage(() => {
          if (productImage) {
            return [...productImage, reader.result];
          } else {
            return [reader.result];
          }
        });
      };
    }
  };

  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          {id.length > 3 ? <h1>Edit Product</h1> : <h1>Create New Product</h1>}
        </div>
        {loadingClicked || (createLoading && <LoadingBox></LoadingBox>)}
        {clickedError ||
          (createError && (
            <MessageBox variant="danger">
              {clickedError ? clickedError : createError}
            </MessageBox>
          ))}
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="price">Price</label>
          <input
            id="price"
            type="text"
            placeholder="Enter Price"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
          ></input>
        </div>

        <div>
          <label htmlFor="category">Category</label>
          <input
            id="category"
            type="text"
            placeholder="Enter Category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="countInStock">Count In Stock</label>
          <input
            id="countInStock"
            type="text"
            placeholder="Enter Count In Stock"
            value={countInStock}
            onChange={(event) => setCountInStock(event.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="brand">Brand</label>
          <input
            id="brand"
            type="text"
            placeholder="Enter Brand"
            value={brand}
            onChange={(event) => setBrand(event.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            type="text"
            placeholder="Enter Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          ></textarea>
        </div>
        <div>
          <label htmlFor="imageFile">Upload File</label>
          <input
            id="imagefile"
            type="file"
            accept="image/*"
            placeholder="Upload Image"
            onChange={uploadFileHandler}
          ></input>
          {createLoading && <LoadingBox></LoadingBox>}
        </div>
        <div className="row left" style={{ height: "10rem" }}>
          {productImage.map((item) => {
            return (
              <div key={Math.random()}>
                <img
                  className="img.small"
                  src={item}
                  alt="photog"
                  style={{ height: "10rem", width: "10rem" }}
                />
              </div>
            );
          })}
        </div>
        <div>
          <label>
            <button className="primary block" type="submit">
              {id.length > 4 ? "Update" : "Create"}
            </button>
          </label>
        </div>
      </form>
    </div>
  );
};

export default ProductEditScreen;
