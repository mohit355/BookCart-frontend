import React, { useState } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth";
import Layout from "../core/Layout";
import { createCategory } from "./apiAdmin";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  // destructure user and token from localstorage
  const { user, token } = isAuthenticated();

  const handleChange = (event) => {
    setError("");
    setName(event.target.value);
  };
  const clickSubmit = (event) => {
    event.preventDefault();
    setError(false);
    setSuccess(false);
    // make request api to create category
    createCategory(user._id, token, { name }).then((data) => {
      if (data.error) {
        setError(true);
      } else {
        setError("");
        setSuccess(true);
      }
    });
  };

  const newCategoryForm = (
    <form onSubmit={clickSubmit}>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          type="text"
          name=""
          id=""
          value={name}
          autoFocus
          required
          className="form-control"
          onChange={handleChange}
        />
      </div>
      <button className="btn btn-outline-primary">Create Category</button>
    </form>
  );

  const showSuccess = success ? (
    <h3 className="text-success">{name} is created</h3>
  ) : null;

  const showError = error ? (
    <h3 className="text-danger">Category should be unique</h3>
  ) : null;

  const goBack = (
    <div className="mt-5">
      <Link to="/admin/dashboard" className="text-warning">
        Back to Dashboard
      </Link>
    </div>
  );

  return (
    <Layout
      title="Add a new Category"
      description={`Good day ${user.name}, ready to add a new category`}
    >
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {showError}
          {showSuccess}
          {newCategoryForm}
          {goBack}
        </div>
      </div>
    </Layout>
  );
};

export default AddCategory;
