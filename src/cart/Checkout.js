import React from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth";

const Checkout = ({ products }) => {
  const getTotal = products.reduce(
    (currVal, nextVal) => currVal + nextVal.count * nextVal.price,
    0
  );

  const showCheckout = isAuthenticated() ? (
    <button className="btn btn-success">Checkout</button>
  ) : (
    <Link to="/signin">
      <button className="btn btn-primary">Sign In to checkout</button>
    </Link>
  );

  return (
    <div>
      <h2>Total : ${getTotal}</h2>
      {showCheckout}
    </div>
  );
};

export default Checkout;
