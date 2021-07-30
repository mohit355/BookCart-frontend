import React, { useEffect, useState } from "react";
import { getStatusValues, listOrders, updateOrderStatus } from "./apiAdmin";
import { isAuthenticated } from "../auth";
import Layout from "../core/Layout";
import moment from "moment";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [statusValues, setStatusValues] = useState([]);
  const { user, token } = isAuthenticated();

  const loadOrders = () => {
    listOrders(user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setOrders(data);
      }
    });
  };

  const loadStatusValues = () => {
    getStatusValues(user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setStatusValues(data);
      }
    });
  };

  useEffect(() => {
    loadOrders();
    loadStatusValues();
  }, []);

  const showOrderLength =
    orders.length > 0 ? (
      <h2 className="text-danger display-2">Total orders: {orders.length}</h2>
    ) : (
      <h2 className="text-danger">No orders placed</h2>
    );

  const showInput = (key, value) => (
    <div className="input-group mb-2 mr-sm-2">
      <div className="input-group-prepend">
        <div className="input-group-text">{key}</div>
      </div>
      <input type="text" value={value} className="form-control" readOnly />
    </div>
  );

  const handleStatusChange = (event, orderId) => {
    // console.log("UPDATE ORDER STATUS");
    updateOrderStatus(user._id, token, orderId, event.target.value).then(
      (data) => {
        if (data.error) {
          console.log("Status update failed");
        } else {
          loadOrders();
        }
      }
    );
  };

  const showStatus = (order) => (
    <div className="form-group">
      <h3 className="mark mb-4">Status: {order.status}</h3>
      <select
        name=""
        id=""
        className="form-control"
        onChange={(e) => handleStatusChange(e, order._id)}
      >
        <option>Update status</option>
        {statusValues.map((status, index) => (
          <option key={index} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <Layout
      title="Orders"
      description={`Good day ${user.name}, you can manage all your orders here`}
    >
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {showOrderLength}
          {orders.map((order, oIndex) => (
            <div
              key={oIndex}
              className="mt-5"
              style={{ borderBottom: "5px solid indigo" }}
            >
              <h2 className="mb-5">
                <spna className="bg-primary">Order Id: {order._id}</spna>
              </h2>
              <ul className="list-group mb-2">
                <li className="list-group-item">{showStatus(order)}</li>
                <li className="list-group-item">
                  Transaction ID: {order.transaction_id}
                </li>
                <li className="list-group-item">Amouunt: {order.amount}</li>
                <li className="list-group-item">Order by: {order.user.name}</li>
                <li className="list-group-item">
                  Ordered on: {moment(order.createdAt).fromNow()}
                </li>
                <li className="list-group-item">
                  Delivery address: {order.address}
                </li>
              </ul>
              <h4 className="mt-4 mb-4 font-italic">
                Total products in the order: {order.products.length}
              </h4>

              {order.products.map((product, pIndex) => (
                <div
                  className="mb-4"
                  key={pIndex}
                  style={{ padding: "20px", border: "1px solid indigo" }}
                >
                  {showInput("Product ID ", product._id)}
                  {showInput("Product name ", product.name)}
                  {showInput("Product price ", product.price)}
                  {showInput("Product total ", product.count)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
