import { useEffect } from "react";
import Product from "../components/Product";
import MessageBox from "../components/MessageBox";
import LoadingBox from "../components/LoadingBox";
import { useSelector, useDispatch } from "react-redux";
import { getProductList } from "../features/productSlice";

const HomeScreen = () => {
  const { productList, isLoading, error } = useSelector(
    (store) => store.products
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProductList());
  }, [dispatch]);

  return (
    <div>
      {isLoading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">
          ...hhhmmm, looks like we are having trouble loading this page.
        </MessageBox>
      ) : (
        <div className="row center">
          {productList.map((product) => {
            return <Product key={product._id} product={product} />;
          })}
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
