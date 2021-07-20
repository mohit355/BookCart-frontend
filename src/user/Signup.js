import React, { useState } from "react";
import Layout from "../core/Layout";
import { Link } from "react-router-dom";
import { userSignup } from "../auth/index";

const Signup = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    success: false,
  });

  const { name, email, password, error, success } = values;

  const handleChange = (event) => {
    setValues({
      ...values,
      error: false,
      [event.target.name]: event.target.value,
    });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false });
    userSignup({ name, email, password }).then((data) => {
      if (data.error) {
        setValues({
          ...values,
          error: data.error,
          success: false,
        });
      } else {
        setValues({
          ...values,
          name: "",
          email: "",
          password: "",
          error: "",
          success: true,
        });
      }
    });
  };

  const signUpForm = (
    <form>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          type="text"
          name="name"
          onChange={handleChange}
          value={values.name}
          id=""
          className="form-control"
        />
      </div>

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

  const showSuccess = (
    <div
      className="alert alert-info"
      style={{ display: success ? "" : "none" }}
    >
      New Account is created. Please <Link to="/signin">Signin</Link>
    </div>
  );

  return (
    <Layout
      title="Sigup"
      description="Sign up to Ecommerce"
      className="container col-md-8 offset-md-2"
    >
      {showSuccess}
      {showError}
      {signUpForm}
    </Layout>
  );
};

export default Signup;
