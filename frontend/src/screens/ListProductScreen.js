import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Pagination from "../components/Pagination";
import { deleteProduct, getProductList } from "../features/productSlice";

const ListProductScreen = () => {
  const [pageNum, setPageNum] = useState(1);
  // this gets the path from where we got here. eg(/listproduct/seller), or (/listproduct)
  const { pathname } = useLocation();
  //here if the pathname includes /seller, we check the index(should be greater than 0). if not from a seller route we return false
  const sellerMode = pathname.indexOf("/seller") >= 0;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

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
  const { userInfo } = useSelector((store) => store.signin);

  useEffect(() => {
    dispatch(
      getProductList({
        seller: sellerMode ? userInfo.id : "",
        pageNumber: pageNum,
      })
    );
  }, [dispatch, deleteSuccess, deleteError, pageNum]);

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
    if (sellerMode) {
      navigate(`/product/${" "}/edit/sellers`);
    } else {
      navigate(`/product/${" "}/edit`);
    }
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
              {productList.map((product) => {
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
                          if (sellerMode) {
                            navigate(`/product/${product._id}/edit/sellers`);
                          } else {
                            navigate(`/product/${product._id}/edit`);
                          }
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
            path={sellerMode ? "/Listofproduct/sellers/" : "/Listofproduct/"}
            setPageNum={setPageNum}
          />
        </>
      )}
    </div>
  );
};

export default ListProductScreen;
