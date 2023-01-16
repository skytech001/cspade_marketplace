import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./features/productSlice";
import clickedProductReducer from "./features/clickedProductSlice";
import addToCartReducer from "./features/addToCartSlice";
import signinReducer from "./features/signinSlice";
import shippingReducer from "./features/shippingSlice";
import paymentReducer from "./features/paymentSlice";
import orderReducer from "./features/placeOrderSlice";
import orderListReducer from "./features/orderListSlice";
import dashboardReducer from "./features/dashboardSlice";

const store = configureStore({
  reducer: {
    products: productReducer,
    clickedProductDetail: clickedProductReducer,
    addToCart: addToCartReducer,
    signin: signinReducer,
    shipping: shippingReducer,
    payment: paymentReducer,
    order: orderReducer,
    orderList: orderListReducer,
    dashboard: dashboardReducer,
  },
});

export default store;
