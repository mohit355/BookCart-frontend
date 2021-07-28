import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../core/Card";
import Layout from "../core/Layout";
import { getCartItem, removeItem } from "./cartHelpers";
import Checkout from "./Checkout";

const Cart = () => {
  const [items, setItems] = useState([]);
  const [run, setRun] = useState(false);

  useEffect(() => {
    setItems(getCartItem());
  }, [run]);

  const showItems = (
    <div>
      <h2>
        Your cart {items.length > 0 ? `has ${items.length} items` : `is empty.`}
        {items.length > 0 ? null : <Link to="/shop">Continue Shopping</Link>}
      </h2>
      <hr />
      {items.length > 0 &&
        items.map((product, index) => (
          <Card
            key={index}
            product={product}
            showAddToCartButton={false}
            cartUpdate={true}
            showRemoveProductButton={true}
            setRun={setRun}
            run={run}
          />
        ))}
    </div>
  );

  return (
    <Layout
      title="Shopping Cart"
      description="Manage your cart items"
      className="container"
    >
      <div className="row">
        <div className="col-6">{showItems}</div>
        <div className="col-6">
          <h2 className="mb-4">Your cart summary</h2>
          <hr />
          <Checkout products={items} setRun={setRun} run={run}></Checkout>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
