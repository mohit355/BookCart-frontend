import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { authenticate, userSignin, isAuthenticated } from "../auth";
import Layout from "../core/Layout";

const Sigin = () => {
  const [values, setValues] = useState({
    email: "mr271232@gmail.com",
    password: "Mr271232@",
    error: "",
    loading: false,
    redirectToReferrer: false,
  });

  const { email, password, error, loading, redirectToReferrer } = values;
  const { user } = isAuthenticated();

  const handleChange = (event) => {
    setValues({
      ...values,
      error: false,
      [event.target.name]: event.target.value,
    });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false, loading: true });
    userSignin({ email, password }).then((data) => {
      if (data.error) {
        setValues({
          ...values,
          error: data.error,
          loading: false,
        });
      } else {
        authenticate(data, () => {
          setValues({
            ...values,
            redirectToReferrer: true,
          });
        });
      }
    });
  };

  const signinForm = (
    <form>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          type="email"
          name="email"
          onChange={handleChange}
          value={values.email}
          id=""
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          type="password"
          name="password"
          onChange={handleChange}
          value={values.password}
          id=""
          className="form-control"
        />
      </div>
      <button onClick={clickSubmit} className="btn btn-primary">
        Submit
      </button>
    </form>
  );

  const showError = (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {values.error}
    </div>
  );

  const showLoading = loading ? (
    <div className="alert alert-info">
      <h2>Loading...</h2>
    </div>
  ) : null;

  const redirectUser = () => {
    if (redirectToReferrer) {
      if (user && user.role === 1) {
        return <Redirect to="/admin/dashboard" />;
      } else {
        return <Redirect to="/user/dashboard" />;
      }
    }

    if (isAuthenticated()) {
      return <Redirect to="/" />;
    }
  };

  return (
    <Layout
      title="Sigin"
      description="Sign in to Ecommerce"
      className="container col-md-8 offset-md-2"
    >
      {showLoading}
      {showError}
      {signinForm}
      {redirectUser()}
    </Layout>
  );
};

export default Sigin;
