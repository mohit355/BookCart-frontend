import React, { useEffect, useState } from "react";
import { getCategories } from "../admin/apiAdmin";
import { list } from "./apiCore";
import Card from "./Card";

const Search = () => {
  const [data, setData] = useState({
    categories: [],
    category: "",
    search: "",
    results: [],
    searched: false,
  });

  const { categories, category, search, results, searched } = data;

  const loadCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setData({ ...data, categories: data });
      }
    });
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
      searched: false,
    });
  };

  const searchData = (search, category) => {
    console.log(search, category);
    if (search) {
      list({ search: search || undefined, category: category }).then(
        (response) => {
          if (response.error) {
            console.log(response.error);
          } else {
            setData({ ...data, results: response, searched: true });
          }
        }
      );
    }
  };

  const searchSubmit = (event) => {
    event.preventDefault();
    searchData(search, category);
  };

  const searchedProduct = (results = []) => {
    return (
      <div>
        {searched && results.length > 0 ? (
          <h5 className="mt-4 mb-4">{`Found ${results.length} products`}</h5>
        ) : null}

        {searched && results.length < 1 ? (
          <h5 className="mt-4 mb-4">{"No product found"}</h5>
        ) : null}

        <div className="row">
          {results.length > 0 &&
            results.map((product, i) => (
              <Card key={i} product={product}></Card>
            ))}
        </div>
      </div>
    );
  };

  const searchForm = (
    <form onSubmit={searchSubmit}>
      <span className="input-group-text">
        <div className="input-group input-group-lg">
          <div className="input-group-prepend">
            <select
              name="category"
              id=""
              className="btn mr-2"
              onChange={handleChange}
            >
              <option value="all">Pick category</option>
              {categories.length > 0 &&
                categories.map((category, index) => (
                  <option key={index} value={category._id}>
                    {category.name}
                  </option>
                ))}
            </select>
          </div>
          <input
            type="search"
            onChange={handleChange}
            name="search"
            placeholder="Search by name"
            className="form-control"
          />
        </div>
        <div className="btn input-group-append" style={{ border: "none" }}>
          <button className="input-group-text"> Search</button>
        </div>
      </span>
    </form>
  );

  return (
    <div className="row">
      <div className="container mb-3">{searchForm}</div>
      <div className="container-fluid mb-3">{searchedProduct(results)}</div>
    </div>
  );
};

export default Search;
