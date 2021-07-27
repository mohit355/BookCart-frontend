import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { isAuthenticated, signout } from "../auth";
import { itemTotal } from "../cart/cartHelpers";

const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#ff9900" };
  } else {
    return { color: "#ffffff" };
  }
};

const Menu = ({ history }) => {
  return (
    <div>
      <ul className="nav nav-tabs bg-primary">
        <li className="nav-item">
          <Link className="nav-link" to="/" style={isActive(history, "/")}>
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className="nav-link"
            to="/shop"
            style={isActive(history, "/shop")}
          >
            Shop
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className="nav-link"
            to="/cart"
            style={isActive(history, "/cart")}
          >
            Cart
            {itemTotal() > 0 && (
              <sup>
                <small className="cart-badge"> {itemTotal()} </small>{" "}
              </sup>
            )}
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className="nav-link"
            to={
              isAuthenticated() && isAuthenticated().user.role === 0
                ? "/user/dashboard"
                : "/admin/dashboard"
            }
            style={isActive(
              history,
              isAuthenticated() && isAuthenticated().user.role === 0
                ? "/user/dashboard"
                : "/admin/dashboard"
            )}
          >
            Dashboard
          </Link>
        </li>

        {!isAuthenticated() && (
          <Fragment>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/signin"
                style={isActive(history, "/signin")}
              >
                Signin
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/signup"
                style={isActive(history, "/signup")}
              >
                Signup
              </Link>
            </li>
          </Fragment>
        )}
        {isAuthenticated() && (
          <li className="nav-item">
            <span
              className="nav-link"
              style={{ cursor: "pointer", color: "#ffffff" }}
              onClick={() =>
                signout(() => {
                  history.push("/");
                })
              }
            >
              Signout
            </span>
          </li>
        )}
      </ul>
    </div>
  );
};

export default withRouter(Menu);
