import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { userSignIn } from "../features/signinSlice";

const SigninScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [loggedIn, set]
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { errorMessage, isSignedIn, signinError, userLoading } = useSelector(
    (state) => state.signin
  );

  useEffect(() => {
    if (isSignedIn) {
      navigate(-1);
      setEmail("");
      setPassword("");
    }
  }, [isSignedIn, navigate, dispatch]);

  const submitHandler = (event) => {
    event.preventDefault();
    dispatch(userSignIn({ email, password }));
  };

  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Sign In</h1>
        </div>
        {userLoading && <LoadingBox />}
        {signinError && (
          <MessageBox variant="danger">{errorMessage}</MessageBox>
        )}
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
          <label htmlFor="password">password</label>
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
          <label />
          <button className="primary" type="submit">
            Sign In
          </button>
        </div>
        <div>
          <label />
          <div>
            {`New Customer? `}
            <Link to="/register">Create Your Account</Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SigninScreen;
