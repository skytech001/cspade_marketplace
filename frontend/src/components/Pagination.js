import React from "react";
import { useState } from "react";
import { useEffect } from "react";

const Pagination = (props) => {
  const { pageSize, list, newList } = props;
  const [isClicked, setIsClicked] = useState(0);

  useEffect(() => {
    newList(pagination());
  }, [newList]);

  const pages = list.length / pageSize;
  const pageNum = [];
  for (let i = 0; i < pages; i++) {
    pageNum.push(i);
  }

  const pagination = (num) => {
    const nums = num ? num : 1;
    const prods = [];
    const start = pageSize * (nums - 1);
    const end = start + pageSize;
    for (let i = start; i < end; i++) {
      if (list.length > i) {
        prods.push(list[i]);
      }
    }
    return prods;
  };

  const pageClickHandler = (num) => {
    newList(pagination(num));
  };

  return (
    <div className="row center">
      {pageNum.map((num) => {
        return (
          <button
            className="pagination"
            type="button"
            key={num + 1}
            onClick={(event) => {
              setIsClicked(num);
              return pageClickHandler(num + 1);
            }}
            style={{
              color: isClicked === num ? "blue" : "",
              borderBottom: isClicked === num ? "1px solid black" : "",
            }}
          >
            {num + 1}
          </button>
        );
      })}
    </div>
  );
};

export default Pagination;
