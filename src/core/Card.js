import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import ShowImage from "./ShowImage";
import moment from "moment";
import { addItem, removeItem, updateItem } from "../cart/cartHelpers";

const Card = ({
  product,
  showViewProductButton = true,
  showAddToCartButton = true,
  cartUpdate = false,
  showRemoveProductButton = false,
  setRun = (f) => f, // default value of function
  run = undefined, // default value of undefined
}) => {
  const [redirect, setRedirect] = useState(false);
  const [count, setCount] = useState(product.count);

  const showViewButton = showViewProductButton && (
    <button className="btn btn-outline-primary mt-2 mb-2 mr-2">
      View Product
    </button>
  );

  const addToCart = (event) => {
    addItem(product, () => {
      setRedirect(true);
    });
  };

  const addToCartButton = showAddToCartButton && (
    <button onClick={addToCart} className="btn btn-outline-warning mt-2 mb-2">
      Add to cart
    </button>
  );

  const removeFromCartButton = showRemoveProductButton && (
    <button
      onClick={() => {
        removeItem(product._id);
        setRun(!run); // run useEffect in parent Cart
      }}
      className="btn btn-outline-danger mt-2 mb-2"
    >
      Remove Product
    </button>
  );

  const shouldRedirect = (redirect) => {
    if (redirect) {
      return <Redirect to="/cart" />;
    }
  };

  const showStock =
    product.quantity > 0 ? (
      <span className="badge badge-primary badge-pill">In Stock</span>
    ) : (
      <span className="badge badge-primary badge-pill">Out of stock</span>
    );

  const handleChange = (event) => {
    setRun(!run); // run useEffect in parent Cart
    setCount(event.target.value < 1 ? 1 : event.target.value);
    if (event.target.value >= 1) {
      updateItem(product._id, event.target.value);
    }
  };

  const cartUpdateOptions = cartUpdate && (
    <div>
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text">Adjust Quantity</span>
        </div>
        <input
          type="number"
          name=""
          id=""
          value={count}
          onChange={handleChange}
          className="form-control"
        />
      </div>
    </div>
  );

  return (
    <div className="card">
      <div className="card-header name">{product.name}</div>
      <div className="card-body">
        {shouldRedirect(redirect)}
        <ShowImage item={product} url="product"></ShowImage>
        <p className="lead mt-2">{product.description.substring(0, 50)}</p>
        <p className="black-10">${product.price}</p>
        <p className="black-9">
          Category: {product.category && product.category.name}
        </p>
        <p className="black-8">
          Added on {moment(product.createdAt).fromNow()}
        </p>
        {showStock}
        <br />

        <Link to={`/product/${product._id}`}>{showViewButton}</Link>
        {addToCartButton}
        {removeFromCartButton}
        {cartUpdateOptions}
      </div>
    </div>
  );
};

export default Card;
