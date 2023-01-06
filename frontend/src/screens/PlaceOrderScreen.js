import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import CheckOutSteps from "../components/CheckOutSteps";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
// import { cartEmpty } from "../features/addToCartSlice";

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import axios from "axios";
import { createNewOrder } from "../features/placeOrderSlice";
import { cartEmpty } from "../features/addToCartSlice";

const PlaceOrderScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { address } = useSelector((state) => state.shipping);
  const { paymentMethod } = useSelector((state) => state.payment);
  const { cartItems } = useSelector((state) => state.addToCart);
  const { orderLoading, orderError, success, thisOrder } = useSelector(
    (state) => state.order
  );
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const roundPrice = (num) => Number(num.toFixed(2)); //this line rounds up the numbers to 2 decemal places. "5.123" =>  5.12
  const itemsPrice = roundPrice(
    cartItems.reduce((acc, item) => acc + item.qty * item.price, 0)
  );

  const shippingPrice = itemsPrice > 100 ? roundPrice(0) : roundPrice(20);
  const taxPrice = roundPrice(0.15 * itemsPrice);
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const newOrder = {
    orderItems: cartItems,
    shippingAddress: address,
    paymentMethod: paymentMethod,
    itemsPrice: itemsPrice,
    shippingPrice: shippingPrice,
    taxPrice: taxPrice,
    totalPrice: totalPrice,
  };

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: totalPrice },
          },
        ],
      })
      .then((id) => id);
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then((details) => {
      dispatch(createNewOrder({ details, newOrder }));
      dispatch(cartEmpty());
    });
  };

  const onError = () => {};

  useEffect(() => {
    const loadPaypalScript = async () => {
      const { data } = await axios.get("http://localhost:5000/keys/paypal");
      paypalDispatch({
        type: "resetOptions",
        value: {
          "client-id": data,
          currency: "USD",
        },
      });
      paypalDispatch({ type: "setLoadingStatus", value: "pending" });
    };

    loadPaypalScript();
    if (!paymentMethod) {
      navigate("/shipping");
    }

    if (success) {
      navigate(`/order/${thisOrder._id}`);
    }
  }, [dispatch, paypalDispatch, thisOrder, navigate, success, paymentMethod]);

  return (
    <div>
      <CheckOutSteps step1 step2 step3 step4></CheckOutSteps>
      <div className="row top">
        <div className="col-2">
          <ul>
            <li>
              <div className="card card-body">
                <h2>Shipping</h2>
                <p>
                  <strong>Name: </strong> {address.fullName} <br />
                  <strong>Address: </strong>
                  {address.address}, {address.city}, {address.state},{" "}
                  {address.postalCode}, {address.country}
                </p>
              </div>
            </li>

            <li>
              <div className="card card-body">
                <h2>Payment</h2>
                <p>
                  <strong>Method:</strong> {paymentMethod}
                </p>
              </div>
            </li>

            <li>
              <div className="card card-body">
                <h2>Order Items</h2>
                <ul>
                  {cartItems.map((item) => {
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
                            <Link to={`/product/${item.product}`}>
                              {item.name}
                            </Link>
                          </div>

                          <div>
                            {item.qty} x ${item.price} = $
                            {item.price * item.qty}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </li>
          </ul>
        </div>

        <div className="col-1">
          <div className="card card-body">
            <ul>
              <li>
                <h2>Order Summary</h2>
              </li>
              <li>
                <div className="row">
                  <div>Items</div>
                  <div>${itemsPrice.toFixed(2)}</div>
                </div>
              </li>

              <li>
                <div className="row">
                  <div>Shipping</div>
                  <div>${shippingPrice.toFixed(2)}</div>
                </div>
              </li>

              <li>
                <div className="row">
                  <div>Tax</div>
                  <div>${taxPrice.toFixed(2)}</div>
                </div>
              </li>

              <li>
                <div className="row">
                  <div>
                    <strong>Order Total</strong>
                  </div>
                  <div>
                    <strong>${totalPrice.toFixed(2)}</strong>
                  </div>
                </div>
              </li>
              <li>
                <div>
                  {isPending ? (
                    <LoadingBox />
                  ) : (
                    <div>
                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                      ></PayPalButtons>
                    </div>
                  )}
                </div>
              </li>
              {orderLoading && <LoadingBox></LoadingBox>}
              {orderError && (
                <MessageBox variant="danger">{orderError}</MessageBox>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderScreen;
