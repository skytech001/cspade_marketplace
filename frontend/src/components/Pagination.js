import React from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

const Pagination = ({ path, setPageNum }) => {
  const { pageNumber = 1 } = useParams();
  const { pages, page } = useSelector((store) => store.products);
  const getFilterUrl = (filter) => {
    const filterPage = filter.page || pageNumber;
    return `${path}pageNumber/${filterPage}`;
  };

  return (
    <div className="row center pagination">
      {[...Array(pages).keys()].map((x) => (
        <Link
          className={x + 1 === page ? "active" : ""}
          key={x + 1}
          to={getFilterUrl({ page: x + 1 })}
          onClick={() => setPageNum(x + 1)}
        >
          {x + 1}
        </Link>
      ))}
    </div>
  );
};

export default Pagination;
