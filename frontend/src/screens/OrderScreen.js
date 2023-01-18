import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { deliverThisOrder, getdetailOrder } from "../features/orderListSlice";

const OrderScreen = () => {
  const dispatch = useDispatch();
  const id = useParams().id;
  const { userInfo } = useSelector((state) => state.signin);
  const {
    deliveredOrder,
    deliverError,
    deliverPending,
    detailError,
    detailLoading,
    orderDetail,
  } = useSelector((state) => state.orderList);

  useEffect(() => {
    dispatch(getdetailOrder(id));
  }, [dispatch, id, deliveredOrder]);

  const deliverHandler = () => {
    dispatch(deliverThisOrder(orderDetail._id));
  };

  return (
    <>
      {detailLoading && <LoadingBox></LoadingBox>}
      {detailError && <MessageBox variant="danger">{detailError}</MessageBox>}
      {orderDetail && (
        <div>
          {/* {thisOrder && (
            <MessageBox>
              <h1>Payment Successful. Thanks for shopping with us</h1>
            </MessageBox>
          )} */}
          <h1>Order {orderDetail._id}</h1>
          <div className="row top">
            <div className="col-2">
              <ul>
                <li>
                  <div className="card card-body">
                    <h2>Shipping</h2>
                    <p>
                      <strong>Name: </strong>{" "}
                      {orderDetail.shippingAddress.fullName} <br />
                      <strong>Address: </strong>
                      {orderDetail.shippingAddress.address},{" "}
                      {orderDetail.shippingAddress.city}
                      {orderDetail.shippingAddress.state},{" "}
                      {orderDetail.shippingAddress.postalCode},{" "}
                      {orderDetail.shippingAddress.country}
                    </p>
                    {orderDetail.isDelivered ? (
                      <MessageBox variant="success">
                        {orderDetail.deliveredAt}
                      </MessageBox>
                    ) : (
                      <MessageBox variant="danger">Not Deliverd</MessageBox>
                    )}
                  </div>
                </li>

                <li>
                  <div className="card card-body">
                    <h2>Payment</h2>
                    <p>
                      <strong>Method:</strong> {orderDetail.paymentMethod}
                    </p>
                    {orderDetail.isPaid ? (
                      <MessageBox variant="success">
                        Paid at {orderDetail.paidAt}
                      </MessageBox>
                    ) : (
                      <MessageBox variant="danger">Not Paid</MessageBox>
                    )}
                  </div>
                </li>

                <li>
                  <div className="card card-body">
                    <h2>Order Items</h2>
                    <ul>
                      {orderDetail.orderItems.map((item) => {
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
                      <div>${orderDetail.itemsPrice.toFixed(2)}</div>
                    </div>
                  </li>

                  <li>
                    <div className="row">
                      <div>Shipping</div>
                      <div>${orderDetail.shippingPrice.toFixed(2)}</div>
                    </div>
                  </li>

                  <li>
                    <div className="row">
                      <div>Tax</div>
                      <div>${orderDetail.taxPrice.toFixed(2)}</div>
                    </div>
                  </li>

                  <li>
                    <div className="row">
                      <div>
                        <strong>Order Total</strong>
                      </div>
                      <div>
                        <strong>${orderDetail.totalPrice.toFixed(2)}</strong>
                      </div>
                    </div>
                  </li>
                  {userInfo.isAdmin &&
                    orderDetail.isPaid &&
                    !orderDetail.isDelivered && (
                      <li>
                        {deliverPending && <LoadingBox></LoadingBox>}
                        {deliverError && (
                          <MessageBox variant="danger">
                            {deliverError}
                          </MessageBox>
                        )}
                        <button
                          type="button"
                          className="primary block"
                          onClick={deliverHandler}
                        >
                          Deliver Order
                        </button>
                      </li>
                    )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderScreen;
