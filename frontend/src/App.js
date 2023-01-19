import { useEffect, useState } from "react";
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
import UserEditScreen from "./screens/UserEditScreen";
import DashboardScreen from "./screens/DashboardScreen";
import SellerAuthRoute from "./components/SellerAuthRoute";
import SellerScreen from "./screens/SellerScreen";
import SearchBox from "./components/SearchBox";
import SearchScreen from "./screens/SearchScreen";
import { getProductCategories } from "./features/productSlice";
import MessageBox from "./components/MessageBox";
import LoadingBox from "./components/LoadingBox";

function App() {
  const { cartItems } = useSelector((state) => state.addToCart);
  const { userInfo, isSignedIn } = useSelector((state) => state.signin);
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const { categories, categoryLoading, categoryError } = useSelector(
    (store) => store.products
  );

  const dispatch = useDispatch();

  const signoutHandler = () => {
    dispatch(userSignout());
  };

  useEffect(() => {
    // dispatch(getProductCategories());
  }, []);

  return (
    <BrowserRouter>
      <div className="grid-container">
        <header className="row">
          <div>
            <button
              className="open-sidebar"
              type="button"
              onClick={() => setSidebarIsOpen(true)}
            >
              <i className="fa fa-bars"></i>
            </button>
            <Link className="brand" to="/">
              Centerspade
            </Link>
          </div>
          <div>
            <SearchBox />
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
            {userInfo && userInfo.isSeller && (
              <div className="dropdown">
                <Link to="#admin">
                  {" "}
                  Seller <i className="fa fa-caret-down"></i>
                </Link>
                <ul className="dropdown-content">
                  <li>
                    <Link to="/Listofproduct/sellers">Products</Link>
                  </li>
                  <li>
                    <Link to="/orderlist/sellers">Orders</Link>
                  </li>
                </ul>
              </div>
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
        <aside className={sidebarIsOpen ? "open" : ""}>
          <ul className="categories">
            <li>
              <strong>Categories</strong>
              <button
                onClick={() => setSidebarIsOpen(false)}
                className="close-sidebar"
                type="button"
              >
                <i className="fa fa-close"></i>
              </button>
            </li>
            {categoryLoading ? (
              <LoadingBox />
            ) : categoryError ? (
              <MessageBox variant="danger">{categoryError}</MessageBox>
            ) : (
              <>
                {categories.map((c) => (
                  <li key={c}>
                    <Link
                      to={`/search/category/${c}`}
                      onClick={() => setSidebarIsOpen(false)}
                    >
                      {c}
                    </Link>
                  </li>
                ))}
              </>
            )}
          </ul>
        </aside>
        <main>
          <Routes>
            <Route path="/cart" element={<CartScreen />}></Route>
            <Route
              path="/product/:id"
              element={<ProductScreen />}
              exact
            ></Route>
            <Route path="/signin" element={<SigninScreen />}></Route>
            <Route path="/seller/:id" element={<SellerScreen />}></Route>
            <Route path="/register" element={<RegisterScreen />}></Route>
            <Route path="/shipping" element={<ShippingAddressScreen />}></Route>
            <Route path="/payment" element={<PaymentMethodScreen />}></Route>
            <Route path="/placeorder" element={<PlaceOrderScreen />}></Route>
            <Route path="/search/name/:name" element={<SearchScreen />}></Route>
            <Route path="/search/name" element={<SearchScreen />}></Route>
            {/* last name param is optional */}
            <Route
              path="/search/category/:category"
              element={<SearchScreen />}
            ></Route>
            <Route
              path="/search/category/:category/name/:name"
              element={<SearchScreen />}
            ></Route>

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
              <Route path="/user/:id/edit" element={<UserEditScreen />}></Route>
              <Route path="/dashboard" element={<DashboardScreen />}></Route>
              <Route
                path="/product/:id/edit"
                element={<ProductEditScreen />}
              ></Route>
            </Route>
            <Route element={<SellerAuthRoute user={userInfo} />}>
              <Route
                path="/product/:id/edit/sellers"
                element={<ProductEditScreen />}
              ></Route>
              <Route
                path="/Listofproduct/sellers"
                element={<ListProductScreen />}
              ></Route>
              <Route
                path="/orderlist/sellers"
                element={<ListOrderScreen />}
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
