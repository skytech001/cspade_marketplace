import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Product from "../components/Product";
import { getProductCategories, getProductList } from "../features/productSlice";

const SearchScreen = () => {
  const { name = "all", category = "all" } = useParams();
  const dispatch = useDispatch();
  const {
    productList,
    isLoading,
    error,
    categories,
    categoryLoading,
    categoryError,
  } = useSelector((store) => store.products);

  useEffect(() => {
    dispatch(
      getProductList({
        name: name !== "all" ? name : "",
        category: category !== "all" ? category : "",
      })
    );
    dispatch(getProductCategories());
  }, [dispatch, name, category]);

  const getFilterUrl = (filter) => {
    const filterCategory = filter.category || category;
    const filterName = filter.name || name;
    return `/search/category/${filterCategory}/name/${filterName}`;
  };

  return (
    <div>
      <div>
        {isLoading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <div>{productList.length} Result</div>
        )}
      </div>
      <div className="row top">
        <div className="col-1">
          <h3>Department</h3>
          {categoryLoading ? (
            <LoadingBox />
          ) : categoryError ? (
            <MessageBox variant="danger">{categoryError}</MessageBox>
          ) : (
            <ul>
              {categories.map((c) => (
                <li key={c}>
                  <Link
                    to={getFilterUrl({ category: c })}
                    className={c === category ? "active" : ""}
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="col-3">
          {isLoading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              {productList.length === 0 && (
                <MessageBox>No Products Found</MessageBox>
              )}
              <div className="row center">
                {productList.map((product) => {
                  return <Product key={product._id} product={product} />;
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchScreen;
