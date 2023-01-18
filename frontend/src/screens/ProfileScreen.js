import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import {
  getDetailedUser,
  profileReset,
  updateUserProfile,
} from "../features/signinSlice";

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [sellerLogo, setSellerLogo] = useState("");
  const [sellerDescription, setSellerDescription] = useState("");
  const { userInfo, updateLoading, updateSuccess, updateError, detailedUser } =
    useSelector((state) => state.signin);

  const dispatch = useDispatch();

  useEffect(() => {
    if (
      (userInfo.isSeller &&
        (!detailedUser.seller || detailedUser._id !== userInfo.id)) ||
      updateSuccess
    ) {
      dispatch(getDetailedUser(userInfo.id));
      dispatch(profileReset());
      // setTimeout(() => dispatch(profileReset()), 3000);
    } else {
      setName(userInfo.name);
      setEail(userInfo.email);
      if (userInfo.isSeller) {
        setSellerName(detailedUser.seller.name);
        setSellerLogo(detailedUser.seller.logo);
        setSellerDescription(detailedUser.seller.description);
      }
    }
  }, [dispatch, updateSuccess, userInfo, detailedUser]);

  //  dispatch(userSignIn())

  const submitHandler = (event) => {
    event.preventDefault();

    if (password !== confirmpassword) {
      alert("Password and Confirmed Password does not match");
    } else {
      dispatch(
        updateUserProfile({
          id: userInfo.id,
          name,
          email,
          password,
          sellerName,
          sellerDescription,
          sellerLogo,
        })
      );
    }
  };

  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>User Profile</h1>
        </div>
        {updateLoading && <LoadingBox></LoadingBox>}
        {updateError && <MessageBox variant="danger">{updateError}</MessageBox>}
        <>
          {updateSuccess && (
            <MessageBox variant="success">
              Profile Updated Successfully
            </MessageBox>
          )}
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              placeholder="Enter Name"
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              placeholder="Enter Email"
              onChange={(event) => setEail(event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter Password"
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="confrimpassword">Confirm Password</label>
            <input
              type="confirmpassword"
              id="confirmpassword"
              placeholder="Re-enter Password"
              onChange={(event) => setConfirmpassword(event.target.value)}
            />
          </div>
          {userInfo.isSeller && detailedUser.seller && (
            <>
              <h2>Seller</h2>
              <div>
                <label htmlFor="sellerName">Seller Name</label>
                <input
                  id="sellerName"
                  typel="text"
                  placeholder="Enter Seller Name"
                  value={sellerName}
                  onChange={(event) => setSellerName(event.target.value)}
                ></input>
              </div>
              <div>
                <label htmlFor="sellerLogo">Seller Logo</label>
                <input
                  id="sellerLogo"
                  typel="text"
                  placeholder="Enter Seller Logo"
                  value={sellerLogo}
                  onChange={(event) => setSellerLogo(event.target.value)}
                ></input>
              </div>
              <div>
                <label htmlFor="sellerDescription">Seller Description</label>
                <input
                  id="sellerDescription"
                  typel="text"
                  placeholder="Enter Seller Description"
                  value={sellerDescription}
                  onChange={(event) => setSellerDescription(event.target.value)}
                ></input>
              </div>
            </>
          )}
          <div>
            <label />
            <button className="primary" type="submit">
              Update
            </button>
          </div>
        </>
      </form>
    </div>
  );
};

export default ProfileScreen;
