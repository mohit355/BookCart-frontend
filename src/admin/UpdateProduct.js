import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth";
import Layout from "../core/Layout";
import { getProduct, getCategories, updateProduct } from "./apiAdmin";

const UpdateProduct = ({ match }) => {
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    categories: [],
    category: "",
    shipping: "",
    quantity: "",
    photo: "",
    loading: false,
    error: "",
    createdproduct: "",
    redirectToProfile: false,
    formData: "",
  });

  const {
    name,
    description,
    price,
    categories,
    category,
    shipping,
    quantity,
    loading,
    error,
    createdproduct,
    redirectToProfile,
    formData,
  } = values;
  const { user, token } = isAuthenticated();

  // Load catrgories and set form data
  const initCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ categories: data, formData: new FormData() });
      }
    });
  };

  const init = (productId) => {
    getProduct(productId).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        //   populate state
        setValues({
          ...values,
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category._id,
          shipping: data.shipping,
          quantity: data.quantity,
          formData: new FormData(),
        });
        // load categories
        initCategories();
      }
    });
  };

  useEffect(() => {
    // initCategories();
    init(match.params.productId);
  }, []);

  const handleChange = (event) => {
    const value =
      event.target.name === "photo"
        ? event.target.files[0]
        : event.target.value;

    const name = event.target.name;
    formData.set(name, value);
    setValues({
      ...values,
      [name]: value,
    });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: "", loading: true });
    updateProduct(match.params.productId, user._id, token, formData).then(
      (data) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setValues({
            ...values,
            name: "",
            description: "",
            price: "",
            quantity: "",
            photo: "",
            loading: false,
            createdproduct: data.result.name,
            redirectToProfile: true,
          });
        }
      }
    );
    console.log(values);
  };

  const newPostForm = (
    <form className="mb-3" onSubmit={clickSubmit}>
      <h4>Post Photo</h4>
      <div className="form-group">
        <label className="btn btn-secondary">
          <input
            onChange={handleChange}
            type="file"
            name="photo"
            accept="image/*"
          />
        </label>
      </div>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Description</label>
        <textarea
          type="text"
          name="description"
          value={description}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Price</label>
        <input
          type="number"
          name="price"
          value={price}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Category</label>
        <select
          name="category"
          onChange={handleChange}
          className="form-control"
        >
          <option>Please Select</option>
          {categories &&
            categories.map((c, i) => (
              <option key={i} value={c._id}>
                {c.name}
              </option>
            ))}
        </select>
      </div>
      <div className="form-group">
        <label className="text-muted">Quantity</label>
        <input
          type="number"
          name="quantity"
          value={quantity}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Shipping</label>
        <select
          name="shipping"
          onChange={handleChange}
          className="form-control"
        >
          <option>Please Select</option>
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>
      </div>
      <button className="btn btn-outline-primary">Update Product</button>
    </form>
  );

  const showError = (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );
  const showSuccess = (
    <div
      className="alert alert-info"
      style={{ display: createdproduct ? "" : "none" }}
    >
      <h3>{`${createdproduct} is update`}</h3>
    </div>
  );

  const showLoading = loading && (
    <div className="alert alert-success">
      <h3>Loading...</h3>
    </div>
  );

  const redirectUser = redirectToProfile && !error ? <Redirect to="/" /> : null;

  return (
    <Layout
      title="Add a new product"
      description={`Good day ${user.name}, ready to add a product category`}
    >
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {showLoading}
          {showError}
          {showSuccess}
          {newPostForm}
          {redirectUser}
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProduct;
