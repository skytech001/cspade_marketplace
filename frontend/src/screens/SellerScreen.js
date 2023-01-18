import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Product from "../components/Product";
import Rating from "../components/Rating";
import { getProductList } from "../features/productSlice";
import { getDetailedUser } from "../features/signinSlice";

const SellerScreen = () => {
  const sellerId = useParams().id;

  const dispatch = useDispatch();
  const { detailedUser, detailedLoading, detailedError } = useSelector(
    (store) => store.signin
  );
  const seller = { ...detailedUser.seller };
  const { productList, isLoading, error } = useSelector(
    (store) => store.products
  );

  useEffect(() => {
    dispatch(getDetailedUser(sellerId));
    dispatch(getProductList({ seller: sellerId }));
  }, [dispatch, sellerId]);

  return (
    <div className="row top">
      <div className="col-1">
        {detailedLoading ? (
          <LoadingBox />
        ) : detailedError ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <ul className="card card-body">
            <li>
              <div className="row start">
                <div className="p1">
                  <img className="small" src={seller.logo} alt={seller.name} />
                </div>
                <div className="p1">
                  <h1>{seller.name}</h1>
                </div>
              </div>
            </li>
            <li>
              <Rating rating={seller.rating} numReviews={seller.numReviews} />
            </li>
            <li>
              <a href={`mailto:${detailedUser.email}`}>Contact Seller</a>
            </li>
            <li>{seller.description}</li>
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
  );
};

export default SellerScreen;
