import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth";
import {
  getBraintreeClientToken,
  processPayment,
} from "../payment/paymentCore";
import DropIn from "braintree-web-drop-in-react";
import { emptyCart, createOrder } from "./cartHelpers";

const Checkout = ({ products, setRun = (f) => f, run = undefined }) => {
  const [data, setData] = useState({
    loading: true,
    success: false,
    clientToken: null,
    error: "",
    instance: {},
    address: "",
  });

  const { address } = data;
  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;

  const getClientToken = (userId, token) => {
    getBraintreeClientToken(userId, token).then((data) => {
      if (data.error) {
        setData({ ...data, error: data.error });
      } else {
        setData({ clientToken: data.clientToken });
      }
    });
  };

  useEffect(() => {
    getClientToken(userId, token);
  }, []);

  const getTotal = products.reduce(
    (currVal, nextVal) => currVal + nextVal.count * nextVal.price,
    0
  );

  const buy = (event) => {
    // send the nonce to the server    nonce  = data.instance.requestPaymentMethod()

    setData({ loading: true });
    let nonce = "";
    let getNonce = data.instance
      .requestPaymentMethod()
      .then((data) => {
        nonce = data.nonce;
        // once you have nonce (card type and number etc) send nonce as paymentMethodNonce and also total to be charged
        const paymentData = {
          paymentMethodNonce: nonce,
          amount: getTotal,
        };

        processPayment(userId, token, paymentData)
          .then((response) => {
            // create order
            const orderData = {
              products: products,
              transaction_id: response.transaction_id
                ? response.transaction_id
                : "asdfg34fde4sdxc34",
              amount: response.params.transaction.amount,
              address: address,
            };

            createOrder(userId, token, orderData).then((response) => {});
            setData({ ...data, success: true });

            // empty cart
            emptyCart(() => {
              console.log("Payment Success and Empty cart");
              setData({ loading: false });
              setRun(!run);
            });
          })
          .catch((error) => {
            console.log("errorerrrrr ", error);
            setData({ loading: false });
          });
      })
      .catch((error) => {
        setData({ ...data, error: error.message });
      });
  };

  const handleAddress = (event) => {
    setData({ ...data, address: event.target.value });
  };

  const showDropIn = (
    <div onBlur={() => setData({ ...data, error: "", success: false })}>
      {data.clientToken !== null && products.length > 0 ? (
        <div>
          <div className="form-group mb-3">
            <label className="text-muted">Delivery Address: </label>
            <textarea
              name=""
              id=""
              cols="30"
              rows="5"
              onChange={handleAddress}
              value={data.address}
              placeholder="Type your delivery address here..."
              className="form-control"
            />
          </div>
          <DropIn
            options={{
              authorization: data.clientToken,
              paypal: { flow: "vault" },
            }}
            onInstance={(instance) => (data.instance = instance)}
          ></DropIn>
          <button onClick={buy} className="btn btn-success btn-block">
            Pay
          </button>
        </div>
      ) : null}
    </div>
  );

  const showCheckout = isAuthenticated() ? (
    <div>{showDropIn}</div>
  ) : (
    <Link to="/signin">
      <button className="btn btn-primary">Sign In to checkout</button>
    </Link>
  );

  const showError = (error) => {
    return (
      <div
        className="alert alert-danger"
        style={{ display: error ? "" : "none" }}
      >
        {error}
      </div>
    );
  };

  const showSuccess = (success) => {
    return (
      <div
        className="alert alert-info"
        style={{ display: success ? "" : "none" }}
      >
        Thanks! Your payment was successfull
      </div>
    );
  };

  const showLoading = (loading) => {
    return loading && <h3>Loading...</h3>;
  };

  return (
    <div>
      <h2>Total : ${getTotal}</h2>
      {showLoading(data.loading)}
      {showSuccess(data.success)}
      {showError(data.error)}
      {showCheckout}
    </div>
  );
};

export default Checkout;
