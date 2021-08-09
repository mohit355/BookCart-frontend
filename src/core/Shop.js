import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import Card from "./Card";
import { getCategories } from "../admin/apiAdmin";
import Checkbox from "./Checkbox";
import { prices } from "./fixedPrices";
import RadioBox from "./RadioBox";
import { getFilteredProduct } from "./apiCore";

const Shop = () => {
  const [myFilters, setMyFilters] = useState({
    filters: {
      category: [],
      price: [],
    },
  });
  const [categories, setCategories] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [error, setError] = useState(false);
  const [limit, setLimit] = useState(10);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(0);

  const init = () => {
    getCategories().then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setCategories(data);
      }
    });
  };

  const loadFilteredResults = (newFilters) => {
    // console.log(newFilters);
    getFilteredProduct(skip, limit, newFilters).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setFilteredResults(data.data);
        setSize(data.size);
        setSkip(0);
      }
    });
  };

  const loadMore = (newFilters) => {
    // console.log(newFilters);
    let toSkip = skip + limit;
    getFilteredProduct(toSkip, limit, myFilters.filters).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setFilteredResults([...data.data, ...filteredResults]);
        setSize(data.size);
        setSkip(toSkip);
      }
    });
  };

  const loadMoreButton = size > 0 && size >= limit && (
    <button className="btn btn-warning mb-5" onClick={loadMore}>
      Load more
    </button>
  );

  useEffect(() => {
    init();
    loadFilteredResults(skip, limit, myFilters.filters);
  }, []);

  const handleFilters = (filters, filterBy) => {
    const newFilters = { ...myFilters };
    newFilters.filters[filterBy] = filters;

    if (filterBy === "price") {
      let priceValues = handlePrice(filters);
      newFilters.filters[filterBy] = priceValues;
    }
    loadFilteredResults(myFilters.filters);
    setMyFilters(newFilters);
  };

  const handlePrice = (id) => {
    const data = prices;
    let array = [];
    for (let key in data) {
      if (data[key]._id === parseInt(id)) {
        array = data[key].array;
      }
    }
    return array;
  };

  return (
    <Layout
      title="Shop Page"
      description="Search and find books of your choice"
      className="container-fluid"
    >
      <div className="row">
        <div className="col-4">
          <h4>Filter by Categories</h4>
          <ul>
            <Checkbox
              handleFilters={(filters) => handleFilters(filters, "category")}
              categories={categories}
            ></Checkbox>
          </ul>

          <h4>Filter by price ranges</h4>
          <div>
            <RadioBox
              handleFilters={(filters) => handleFilters(filters, "price")}
              prices={prices}
            ></RadioBox>
          </div>
        </div>
        <div className="col-8">
          <h2 className="mb-4">Products</h2>
          <div className="row">
            {filteredResults && filteredResults.length > 0
              ? filteredResults.map((product, index) => (
                  <div key={index} className="col-4 mb-3">
                    <Card product={product}></Card>
                  </div>
                ))
              : null}
          </div>
          <hr />
          {filteredResults && filteredResults.length === 0 && (
            <h6>No products found</h6>
          )}
          {loadMoreButton}
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
