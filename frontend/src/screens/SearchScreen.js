import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Product from "../components/Product";
import Rating from "../components/Rating";
import { getProductCategories, getProductList } from "../features/productSlice";
import { prices, ratings } from "./utils";

const SearchScreen = () => {
  const navigate = useNavigate();
  const {
    name = "all",
    category = "all",
    min = 0,
    max = 0,
    rating = 0,
    order = "newest",
  } = useParams();
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
        min,
        max,
        rating,
        order,
      })
    );
    dispatch(getProductCategories());
  }, [dispatch, name, category, min, max, rating, order]);

  const getFilterUrl = (filter) => {
    const filterCategory = filter.category || category;
    const filterName = filter.name || name;
    const filterRating = filter.rating || rating;
    const sortOrder = filter.order || order;
    const filterMin = filter.min ? filter.min : filter.min === 0 ? 0 : min;
    const filterMax = filter.max ? filter.max : filter.max === 0 ? 0 : max;
    return `/search/category/${filterCategory}/name/${filterName}/min/${filterMin}/max/${filterMax}/rating/${filterRating}/order/${sortOrder}`;
  };

  return (
    <div>
      <div className="row">
        {isLoading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <div>{productList.length} Result</div>
        )}
        <div>
          Sort by{" "}
          <select
            value={order}
            onChange={(event) => {
              navigate(getFilterUrl({ order: event.target.value }));
            }}
          >
            <option value="newest">Newest Arrivals</option>
            <option value="lowest">Price: Low to High</option>
            <option value="highest">Price: High to Low</option>
            <option value="toprated">Avg. Customer Reviews</option>
          </select>
        </div>
      </div>
      <div className="row top">
        <div className="col-1">
          <h3>Department</h3>
          <div>
            {categoryLoading ? (
              <LoadingBox />
            ) : categoryError ? (
              <MessageBox variant="danger">{categoryError}</MessageBox>
            ) : (
              <ul>
                <li>
                  <Link
                    to={getFilterUrl({ category: "all" })}
                    className={"all" === category ? "active" : ""}
                  >
                    Any
                  </Link>
                </li>
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

          <div>
            <h3>Price</h3>
            <ul>
              {prices.map((p) => (
                <li key={p.name}>
                  <Link
                    to={getFilterUrl({ min: p.min, max: p.max })}
                    className={
                      `${p.min}-${p.max}` === `${min}-${max}` ? "active" : ""
                    }
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3>Avg Customer Reviews</h3>
            <ul>
              {ratings.map((r) => (
                <li key={r.name}>
                  <Link
                    to={getFilterUrl({ rating: r.rating })}
                    className={`${r.rating}` === `${rating}` ? "active" : ""}
                  >
                    <Rating caption="& up" rating={r.rating}></Rating>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
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
