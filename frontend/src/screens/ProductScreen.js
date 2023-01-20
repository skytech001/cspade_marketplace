import React, { useEffect, useState } from "react";
import Rating from "../components/Rating";

import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getClickedProduct } from "../features/clickedProductSlice";
import { addItemToCart } from "../features/addToCartSlice";
import MessageBox from "../components/MessageBox";
import { createReview, createReviewReset } from "../features/productSlice";
import LoadingBox from "../components/LoadingBox";

const ProductScreen = (props) => {
  const navigate = useNavigate();
  const params = useParams();
  const { clickedProd } = useSelector((state) => state.clickedProductDetail);
  const { userInfo } = useSelector((store) => store.signin);
  const { review, reviewLoading, reviewError, reviewMessage } = useSelector(
    (store) => store.products
  );
  const [prodImage, setProdImage] = useState("");
  const dispatch = useDispatch();
  const [qty, setQty] = useState(1);
  const id = params.id;
  const productImage = clickedProd.image;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    setTimeout(() => dispatch(createReviewReset()), 2000);

    dispatch(getClickedProduct(id));
    // setProdImage(clickedProd.image[0]);
  }, [dispatch, id, reviewMessage, reviewError]);

  const addToCartHandler = () => {
    navigate(`/cart`);
    dispatch(addItemToCart({ id, qty }));
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (comment && rating) {
      dispatch(createReview({ id: id, rating, comment, name: userInfo.name }));
      setRating("");
      setComment("");
    } else {
      alert("Please enter comment and rating");
    }
  };

  if (!clickedProd) {
    return <div>Product Not Found</div>;
  }
  return (
    <div>
      {clickedProd.name && (
        <>
          <Link to="/">Back to result</Link>
          <div className="row top">
            <div className="col-2">
              <img
                className="large"
                src={prodImage ? prodImage : clickedProd.image[0]}
                alt={clickedProd.name}
              />
              <div className="row left" style={{ height: "10rem" }}>
                {productImage.map((item) => {
                  return (
                    <div key={Math.random()}>
                      <img
                        onClick={() => {
                          setProdImage(item);
                        }}
                        className="img.small"
                        src={item}
                        alt="photog"
                        style={{ height: "10rem", width: "10rem" }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="col-1">
              <ul>
                <li>
                  <h1>{clickedProd.name}</h1>
                </li>
                <li>
                  <Rating
                    rating={clickedProd.rating}
                    numReviews={clickedProd.numReviews}
                  />
                </li>
                <li>Price : ${clickedProd.price}</li>
                <li>
                  Description:
                  <p>{clickedProd.description}</p>
                </li>
              </ul>
            </div>
            <div className="col-1">
              <div className="card card-body">
                <ul>
                  <li>
                    Seller{" "}
                    <h2>
                      <Link to={`/seller/${clickedProd.seller._id}`}>
                        {clickedProd.seller.seller.name}
                      </Link>
                    </h2>
                    <Rating
                      rating={clickedProd.seller.seller.rating}
                      numReviews={clickedProd.seller.seller.numReviews}
                    ></Rating>
                  </li>
                  <li>
                    <div className="row">
                      <div>Price</div>
                      <div className="price">${clickedProd.price}</div>
                    </div>
                  </li>

                  <li>
                    <div className="row">
                      <div>Status:</div>
                      <div>
                        {clickedProd.countInStock > 0 ? (
                          <span className="success">In Stock</span>
                        ) : (
                          <span className="danger">Unavailable</span>
                        )}
                      </div>
                    </div>
                  </li>
                  {clickedProd.countInStock > 0 && (
                    <>
                      <li>
                        <div className="row">
                          <div>Qty</div>
                          <div>
                            <select
                              value={qty}
                              onChange={(e) => setQty(e.target.value)}
                            >
                              {/* the next line is an array constructor with a spread operator. it creates a new array with the length of
                            clickedProd.countinstock. countinstock is a number.the entire operation returns the keys of each spot in  the array. */}
                              {[...Array(clickedProd.countInStock).keys()].map(
                                (x) => {
                                  return (
                                    <option key={x + 1} value={x + 1}>
                                      {x + 1}
                                    </option>
                                  ); //here we get each key and add one because the array starts at 0.
                                }
                              )}
                            </select>
                          </div>
                        </div>
                      </li>
                      <li>
                        <button
                          onClick={addToCartHandler}
                          className="primary block"
                        >
                          Add To Cart
                        </button>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
          <div>
            <h2 id="reviews">Reviews</h2>
            {clickedProd.reviews.length === 0 && (
              <MessageBox variant="success">There is no review</MessageBox>
            )}
            <ul>
              {clickedProd.reviews.map((review) => {
                return (
                  <li key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating rating={review.rating} caption=" "></Rating>
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </li>
                );
              })}
              <li>
                {userInfo.name ? (
                  <form className="form" onSubmit={submitHandler}>
                    <div>
                      <h2>Write a review</h2>
                    </div>
                    <div>
                      <label htmlFor="rating">Rating</label>
                      <select
                        id="rating"
                        value={rating}
                        onChange={(event) => setRating(event.target.value)}
                      >
                        <option value="">Select</option>
                        <option value="1">1- Poor</option>
                        <option value="2">2- Fair</option>
                        <option value="3">3- Good</option>
                        <option value="4">4- Very Good</option>
                        <option value="5">5- Excelent</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="comment">Comment</label>
                      <textarea
                        id="comment"
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                      ></textarea>
                    </div>
                    <div>
                      <label />
                      <button type="submit" className="primary">
                        Submit
                      </button>
                    </div>
                    <div>
                      {reviewLoading && <LoadingBox />}
                      {reviewError && (
                        <MessageBox variant="danger">{reviewError}</MessageBox>
                      )}
                      {reviewMessage && (
                        <MessageBox variant="success">
                          {reviewMessage}
                        </MessageBox>
                      )}
                    </div>
                  </form>
                ) : (
                  <MessageBox variant="danger">
                    Please <Link to="/signin">Sign In</Link> to write a review
                  </MessageBox>
                )}
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductScreen;
