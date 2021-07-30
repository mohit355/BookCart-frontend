import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth";
import { getProducts } from "../core/apiCore";
import Layout from "../core/Layout";
import { deleteProduct } from "./apiAdmin";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const { user, token } = isAuthenticated();

  const loadProducts = () => {
    getProducts().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setProducts(data);
      }
    });
  };

  const destroy = (productId) => {
    deleteProduct(productId, user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        loadProducts();
        // setProducts(data);
      }
    });
  };

  useEffect(() => {
    loadProducts();
  }, []);
  return (
    <Layout
      title="Manage products"
      description="Perform CRUD on products"
      className="container"
    >
      {/* <h2 className="mb-4">Manage products</h2> */}
      <div className="row">
        <div className="col-12">
          <h2 className="text-center">Total {products.length} products</h2>
          <hr />
          <ul className="list-group">
            {products.map((product, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <strong>{product.name}</strong>
                <Link to={`/admin/product/update/${product._id}`}>
                  <span className="badge badge-warning badge-pill">Update</span>
                </Link>
                <span
                  onClick={() => destroy(product._id)}
                  className="badge badge-danger badge-pill"
                >
                  Delete
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default ManageProducts;
