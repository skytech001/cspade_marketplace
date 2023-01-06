import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { userRegister } from "../features/signinSlice";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const [loggedIn, set]
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { errorMessage, isSignedIn, signinError, userLoading } = useSelector(
    (state) => state.signin
  );

  useEffect(() => {
    if (isSignedIn) {
      navigate("/");
    }
  }, [isSignedIn, navigate, dispatch]);

  const submitHandler = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Password does not match");
    } else {
      dispatch(userRegister({ name, email, password }));
    }
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Create Your Account</h1>
        </div>
        {userLoading && <LoadingBox />}
        {signinError && (
          <MessageBox variant="danger">{errorMessage}</MessageBox>
        )}
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="name"
            id="name"
            value={name}
            placeholder="Enter Name"
            required
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            placeholder="Enter Email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            value={password}
            id="password"
            placeholder="Enter Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="confrimpassword">Confirm Password</label>
          <input
            type="confirmpassword"
            value={confirmPassword}
            id="confirmpassword"
            placeholder="Re-enter Password"
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div>
          <label />
          <button className="primary" type="submit">
            Register
          </button>
        </div>
        <div>
          <label />
          <div>
            {`Alredy have an account? `}
            <Link to="/signin">Sign In</Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegisterScreen;
