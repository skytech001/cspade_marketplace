import { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Product from "../components/Product";
import MessageBox from "../components/MessageBox";
import LoadingBox from "../components/LoadingBox";
import { useSelector, useDispatch } from "react-redux";
import { getProductList } from "../features/productSlice";
import { getTopSellers } from "../features/signinSlice";
import Pagination from "../components/Pagination";
import Banner from "../components/Banner";

const HomeScreen = () => {
  const [pageNum, setPageNum] = useState(1);
  const { productList, isLoading, error } = useSelector(
    (store) => store.products
  );
  const { topSeller, topSellerLoading, topSellerError } = useSelector(
    (store) => store.signin
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProductList({ pageNumber: pageNum }));
    dispatch(getTopSellers());
  }, [dispatch, pageNum]);

  return (
    <div className="home-container">
      <Banner />
      <>
        <h2>Featured Products</h2>
        {isLoading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">
            ...hhhmmm, looks like we are having trouble loading this page.
          </MessageBox>
        ) : (
          <div>
            {productList.length === 0 && (
              <MessageBox>No Products Found</MessageBox>
            )}
            <div className="row center container">
              {productList.map((product) => {
                return <Product key={product._id} product={product} />;
              })}
            </div>
          </div>
        )}
        <Pagination path={"/"} setPageNum={setPageNum} />
      </>
    </div>
  );
};

export default HomeScreen;
