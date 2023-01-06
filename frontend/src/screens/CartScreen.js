import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import MessageBox from "../components/MessageBox";
import { addItemToCart, removeItem } from "../features/addToCartSlice";

const CartScreen = () => {
  const { cartItems } = useSelector((state) => state.addToCart);
  const { isSignedIn } = useSelector((state) => state.signin);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const removeFromCart = (id) => {
    dispatch(removeItem(id));
  };

  const checkoutHandler = () => {
    if (!isSignedIn) {
      navigate("/signin");
    } else {
      navigate("/shipping"); //the redirect means after signin user should be redirected to shipping
    }
  };

  return (
    <div className="row top">
      <div className="col-2">
        <h1>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <MessageBox>
            Cart is empty<Link to="/">Go Shopping</Link>
          </MessageBox>
        ) : (
          <ul>
            {cartItems.map((item) => {
              const id = item.product;
              return (
                <li key={item.product}>
                  <div className="row">
                    <div>
                      <img
                        src={item.image[0]}
                        alt={item.name}
                        className="small"
                      ></img>
                    </div>
                    <div className="min-30rem">
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </div>
                    <div>
                      <select
                        value={item.qty}
                        onChange={(event) => {
                          const qty = event.target.value;
                          dispatch(addItemToCart({ id, qty }));
                        }}
                      >
                        {[...Array(item.countInStock).keys()].map((x) => {
                          return (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ); //here we get each key and add one because the array starts at 0.
                        })}
                      </select>
                    </div>
                    <div>${item.price * item.qty}</div>
                    <div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div className="col-1">
        <div className="card card-body">
          <ul>
            <li>
              <h2>
                Subtotal (
                {cartItems.reduce((acc, item) => {
                  return acc + +item.qty;
                }, 0)}
                Items ) : $
                {cartItems.reduce((acc, item) => {
                  return acc + +item.price * item.qty;
                }, 0)}
              </h2>
            </li>
            <li>
              <button
                type="button"
                onClick={checkoutHandler}
                className="primary block"
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CartScreen;
