import React, { useEffect, useState } from "react";
import { read } from "./apiCore";
import Card from "./Card";
import Layout from "./Layout";

const Product = (props) => {
  const [product, setProduct] = useState({});
  const [error, setError] = useState(false);

  const loadSingleProduct = (productId) => {
    read(productId).then((data) => {
      if (data.error) {
        setError(data.error);
      }
      setProduct(data);
    });
  };

  useEffect(() => {
    const productId = props.match.params.productId;
    loadSingleProduct(productId);
  }, []);

  return (
    <Layout
      title={product && product.name}
      description={
        product && product.description && product.description.substring(0, 100)
      }
      className="container-fluid"
    >
      <div className="row">
        {product && product.description && (
          <Card product={product} showViewProductButton={false}></Card>
        )}
      </div>
    </Layout>
  );
};

export default Product;
