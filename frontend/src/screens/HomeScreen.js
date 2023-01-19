import { useEffect } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel, carousel } from "react-responsive-carousel";
import Product from "../components/Product";
import MessageBox from "../components/MessageBox";
import LoadingBox from "../components/LoadingBox";
import { useSelector, useDispatch } from "react-redux";
import { getProductList } from "../features/productSlice";
import { getTopSellers } from "../features/signinSlice";
import { Link } from "react-router-dom";

const HomeScreen = () => {
  const { productList, isLoading, error } = useSelector(
    (store) => store.products
  );
  const { topSeller, topSellerLoading, topSellerError } = useSelector(
    (store) => store.signin
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProductList({}));
    dispatch(getTopSellers());
  }, [dispatch]);

  return (
    <div>
      <h2>Top Sellers</h2>
      {topSellerLoading ? (
        <LoadingBox />
      ) : topSellerError ? (
        <MessageBox variant="danger">{topSellerError}</MessageBox>
      ) : (
        <>
          {topSeller.length === 0 && <MessageBox>No Sellers Found</MessageBox>}
          <Carousel showArrows autoPlay showThumbs={false}>
            {topSeller.map((seller) => (
              <div key={seller._id}>
                <Link to={`/seller/${seller._id}`}>
                  <img src={seller.seller.logo} alt={seller.seller.name} />
                  <p className="legend">{seller.seller.name}</p>
                </Link>
              </div>
            ))}
          </Carousel>
        </>
      )}
      <h2>Featured Products</h2>
      {isLoading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">
          ...hhhmmm, looks like we are having trouble loading this page.
        </MessageBox>
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
  );
};

export default HomeScreen;
