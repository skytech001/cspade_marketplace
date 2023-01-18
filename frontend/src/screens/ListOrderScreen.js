import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import {
  deleteOrder,
  deleteOrderReset,
  getAllOrders,
} from "../features/orderListSlice";

const ListOrderScreen = () => {
  const { pathname } = useLocation();
  const sellerMode = pathname.indexOf("/seller") >= 0;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    allOrders,
    allOrderLoading,
    allOrderError,
    deleteSuccess,
    deleteMessage,
  } = useSelector((state) => state.orderList);
  const { userInfo } = useSelector((store) => store.signin);

  useEffect(() => {
    dispatch(getAllOrders({ seller: sellerMode ? userInfo.id : "" }));
    if (deleteSuccess) {
      setTimeout(() => {
        dispatch(deleteOrderReset());
      }, 4000);
    }
  }, [dispatch, deleteSuccess]);

  const deleteHandler = (order) => {
    if (
      window.confirm(
        "This can not be reversed. Are you sure you want to delete this order?"
      )
    ) {
      dispatch(deleteOrder(order._id));
    }
  };

  return (
    <div>
      <div>
        <h1>Orders</h1>
        {allOrderLoading && <LoadingBox></LoadingBox>}
        {allOrderError && <MessageBox variant="danger"></MessageBox>}
        {deleteSuccess && (
          <MessageBox variant="success">{deleteMessage}</MessageBox>
        )}
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          {allOrders.length > 0 && (
            <tbody>
              {allOrders.map((order) => {
                return (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.user.name}</td>
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td>{order.totalPrice.toFixed(2)}</td>
                    <td>
                      {order.isPaid ? order.paidAt.substring(0, 10) : "No"}
                    </td>
                    <td>
                      {order.isDelivered
                        ? order.deliveredAt.substring(0, 10)
                        : "No"}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="small"
                        onClick={() => {
                          allOrders.filter((item) => item._id === order._id);
                          navigate(`/order/${order._id}`);
                        }}
                      >
                        Details
                      </button>
                      <button
                        className="small"
                        type="button"
                        onClick={() => deleteHandler(order)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default ListOrderScreen;
