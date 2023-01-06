import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { profileReset, updateUserProfile } from "../features/signinSlice";

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const { userInfo, updateLoading, updateSuccess, updateError, isSignedIn } =
    useSelector((state) => state.signin);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setName(userInfo.name);
    setEail(userInfo.email);
    dispatch(profileReset());
  }, [dispatch, navigate, isSignedIn, userInfo]);

  //  dispatch(userSignIn())

  const submitHandler = (event) => {
    event.preventDefault();

    if (password !== confirmpassword) {
      alert("Password and Confirmed Password does not match");
    } else {
      dispatch(updateUserProfile({ id: userInfo.id, name, email, password }));
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
