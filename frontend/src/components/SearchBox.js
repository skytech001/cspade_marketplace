import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBox = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const submitHandler = (event) => {
    event.preventDefault();
    navigate(`/search/name/${name}?`);
  };
  return (
    <form className="search" onSubmit={submitHandler}>
      <div className="row">
        <input
          type="text"
          name="q"
          id="q"
          onChange={(event) => setName(event.target.value)}
        ></input>
        <button className="primary" type="submit">
          <i className="fa fa-search icon"></i>
        </button>
      </div>
    </form>
  );
};

export default SearchBox;
