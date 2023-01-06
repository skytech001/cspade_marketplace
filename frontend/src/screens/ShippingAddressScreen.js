import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CheckOutSteps from "../components/CheckOutSteps";
import { saveShippingAddress } from "../features/shippingSlice";

const ShippingAddressScreen = () => {
  const { cartItems } = useSelector((state) => state.addToCart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/");
    }
  }, [cartItems, navigate]);

  const submitHandler = (event) => {
    event.preventDefault();
    const fullAddress = {
      fullName,
      address,
      city,
      state,
      postalCode,
      country,
    };
    dispatch(saveShippingAddress(fullAddress));
    navigate("/payment");
  };

  return (
    <div>
      <CheckOutSteps step1 step2></CheckOutSteps>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Shipping Address</h1>
        </div>
        <div>
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            placeholder="Enter full name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            required
          ></input>
        </div>

        <div>
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            placeholder="Enter Address"
            onChange={(event) => setAddress(event.target.value)}
            required
          ></input>
        </div>

        <div>
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            placeholder="Enter City"
            onChange={(event) => setCity(event.target.value)}
            required
          ></input>
        </div>

        <div>
          <label htmlFor="state">State</label>
          <input
            type="text"
            id="state"
            placeholder="Enter State"
            onChange={(event) => setState(event.target.value)}
            required
          ></input>
        </div>

        <div>
          <label htmlFor="postalCode ">Postal Code</label>
          <input
            type="text"
            id="postalCode "
            placeholder="Enter Postal Code"
            onChange={(event) => setPostalCode(event.target.value)}
            required
          ></input>
        </div>

        <div>
          <label htmlFor="countrty">Country</label>
          <input
            type="text"
            id="country"
            placeholder="Enter Country"
            onChange={(event) => setCountry(event.target.value)}
            required
          ></input>
        </div>
        <div>
          <label />
          <button className="primary" type="submit">
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShippingAddressScreen;
