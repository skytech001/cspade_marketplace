import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import CartScreen from "./screens/CartScreen";
import { useDispatch, useSelector } from "react-redux";
import SigninScreen from "./screens/SigninScreen";
import { userSignout } from "./features/signinSlice";
import RegisterScreen from "./screens/RegisterScreen";
import ShippingAddressScreen from "./screens/ShippingAddressScreen";
import PaymentMethodScreen from "./screens/PaymentMethodScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import ProfileScreen from "./screens/ProfileScreen";
import OrderHistoryScreen from "./screens/OrderHistoryScreen";
import PrivateRoute from "./components/PrivateRoute";
import AdminAuthRooute from "./components/AdminAuthRooute";
import ListProductScreen from "./screens/ListProductScreen";
import ProductEditScreen from "./screens/ProductEditScreen";
import ListOrderScreen from "./screens/ListOrderScreen";
import ListUserScreen from "./screens/ListUserScreen";

function App() {
  const { cartItems } = useSelector((state) => state.addToCart);
  const { userInfo, isSignedIn } = useSelector((state) => state.signin);

  const dispatch = useDispatch();

  const signoutHandler = () => {
    dispatch(userSignout());
  };

  return (
    <BrowserRouter>
      <div className="grid-container">
        <header className="row">
          <div>
            <Link className="brand" to="/">
              Centerspade
            </Link>
          </div>
          <div>
            <Link to="/cart">
              Cart
              {cartItems.length > 0 && (
                <span className="badge">{cartItems.length}</span>
              )}
            </Link>
            {userInfo.name ? (
              <div className="dropdown">
                <Link to="#">
                  {isSignedIn && `${userInfo.name}`}{" "}
                  <i className="fa fa-caret-down"></i>
                </Link>
                <ul className="dropdown-content">
                  <li>
                    <Link to="/profile">User Profile</Link>
                  </li>
                  <li>
                    <Link to="/orderhistory">My Orders</Link>
                  </li>
                  <li>
                    <Link to="#signout" onClick={signoutHandler}>
                      Sign Out
                    </Link>
                  </li>
                </ul>
              </div>
            ) : (
              <Link to="/signin">Sign In</Link>
            )}
            {userInfo && userInfo.isAdmin && (
              <div className="dropdown">
                <Link to="#admin">
                  {" "}
                  Admin <i className="fa fa-caret-down"></i>
                </Link>
                <ul className="dropdown-content">
                  <li>
                    <Link to="/dashboard">Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/Listofproduct">Products</Link>
                  </li>
                  <li>
                    <Link to="/orderlist">Orders</Link>
                  </li>
                  <li>
                    <Link to="/userslist">Users</Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/cart" element={<CartScreen />}></Route>
            <Route
              path="/product/:id"
              element={<ProductScreen />}
              exact
            ></Route>
            <Route path="/signin" element={<SigninScreen />}></Route>

            <Route path="/register" element={<RegisterScreen />}></Route>
            <Route path="/shipping" element={<ShippingAddressScreen />}></Route>
            <Route path="/payment" element={<PaymentMethodScreen />}></Route>
            <Route path="/placeorder" element={<PlaceOrderScreen />}></Route>

            <Route element={<PrivateRoute user={userInfo} />}>
              <Route path="/profile" element={<ProfileScreen />}></Route>
              <Route path="/order/:id" element={<OrderScreen />}></Route>
              <Route
                path="orderhistory"
                element={<OrderHistoryScreen />}
              ></Route>
            </Route>
            <Route element={<AdminAuthRooute user={userInfo} />}>
              <Route
                path="/Listofproduct"
                element={<ListProductScreen />}
              ></Route>
              <Route path="/userslist" element={<ListUserScreen />}></Route>
              <Route path="/orderlist" element={<ListOrderScreen />}></Route>
              <Route
                path="/product/:id/edit"
                element={<ProductEditScreen />}
              ></Route>
            </Route>

            <Route path="/" element={<HomeScreen />} exact></Route>
          </Routes>
        </main>

        <footer className="row center">All right reserved</footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
