import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Pagination from "../components/Pagination";
import { deleteProduct, getProductList } from "../features/productSlice";

const ListProductScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [display, setDisplay] = useState([]);
  const {
    productList,
    isLoading,
    error,
    createLoading,
    createError,
    deleteLoading,
    deleteError,
    deleteSuccess,
  } = useSelector((store) => store.products);

  const pageSize = 10;

  useEffect(() => {
    dispatch(getProductList());
    setDisplay((data) => data);
  }, [dispatch, deleteSuccess]);

  const deleteHandler = (product) => {
    if (
      window.confirm(
        "This can not be reversed. Are you sure you want to delete this product?"
      )
    ) {
      dispatch(deleteProduct(product));
    }
  };

  const createHandler = () => {
    navigate(`/product/${" "}/edit`);
  };

  return (
    <div>
      <div className="row">
        <h1>Products</h1>

        <button type="button" className="primary" onClick={createHandler}>
          Create New Product
        </button>
      </div>
      {createLoading && <LoadingBox></LoadingBox>}
      {createError && <MessageBox variant="danger">{createError}</MessageBox>}
      {deleteLoading && <LoadingBox></LoadingBox>}
      {deleteError && <MessageBox variant="danger">{deleteError}</MessageBox>}
      {isLoading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {display.map((product) => {
                return (
                  <tr key={product._id}>
                    <td>{product._id}</td>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>{product.category}</td>
                    <td>{product.brand}</td>
                    <td>
                      <button
                        type="button"
                        className="small"
                        onClick={() => {
                          navigate(`/product/${product._id}/edit`);
                        }}
                      >
                        Edit
                      </button>
                      &nbsp;
                      <button
                        type="button"
                        className="small"
                        onClick={() => deleteHandler(product)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Pagination
            pageSize={pageSize}
            list={productList}
            newList={setDisplay}
          />
        </>
      )}
    </div>
  );
};

export default ListProductScreen;
