import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import {
  getDetailedUser,
  resetUpdate,
  updateUser,
} from "../features/signinSlice";

const UserEditScreen = () => {
  const navigate = useNavigate();
  const params = useParams().id;
  const dispatch = useDispatch();
  const {
    detailedUser,
    detailedError,
    detailedLoading,
    userUpdateLoading,
    userupdateError,
    userUpdateSuccess,
  } = useSelector((store) => store.signin);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSeller, setIsSeller] = useState("");
  const [isAdmin, setIsAdmin] = useState("");

  useEffect(() => {
    if (userUpdateSuccess) {
      dispatch(resetUpdate());
      navigate("/userslist");
    }
    if (!detailedUser.name || detailedUser._id !== params) {
      dispatch(getDetailedUser(params));
    } else {
      setName(detailedUser.name);
      setEmail(detailedUser.email);
      setIsSeller(detailedUser.isSeller);
      setIsAdmin(detailedUser.isAdmin);
    }
  }, [detailedUser.name, userUpdateSuccess]);

  const submitHandler = (event) => {
    event.preventDefault();
    dispatch(updateUser({ id: params, name, email, isSeller, isAdmin }));
  };

  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Edit User</h1>
          {userUpdateLoading && <LoadingBox />}
          {userupdateError && <MessageBox variant="danger"></MessageBox>}
        </div>
        {detailedLoading ? (
          <LoadingBox />
        ) : detailedError ? (
          <MessageBox variant="danger">{detailedError}</MessageBox>
        ) : (
          <>
            <div>
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                }}
              ></input>
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
              ></input>
            </div>
            <div>
              <label htmlFor="isSeller">Is Seller</label>
              <input
                id="isSeller"
                type="checkbox"
                checked={isSeller}
                onChange={(event) => {
                  setIsSeller(event.target.checked);
                }}
              ></input>
            </div>
            <div>
              <label htmlFor="isAdmin">Is Admin</label>
              <input
                id="isAdmin"
                type="checkbox"
                checked={isAdmin}
                onChange={(event) => {
                  setIsAdmin(event.target.checked);
                }}
              ></input>
            </div>
            <div>
              <button type="submit" className="primary">
                Update
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default UserEditScreen;
