import { API } from "../config";
import queryString from "query-string";

export const getProducts = (sortBy) => {
  return fetch(`${API}/products?sortBy=${sortBy}&orderBy=desc&limit=20`, {
    method: "GET",
  })
    .then((response) => response.json())
    .catch((err) => err);
};

export const getCategories = () => {
  return fetch(`${API}/categories`, {
    method: "GET",
  })
    .then((response) => response.json())
    .catch((err) => err);
};

export const getFilteredProduct = (skip, limit, filters = {}) => {
  const data = {
    limit,
    skip,
    filters,
  };
  return fetch(`${API}/products/by/search`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .catch((err) => err);
};

export const list = (params) => {
  const query = queryString.stringify(params);
  console.log("QUERY ", query);
  return fetch(`${API}/products/search?${query}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .catch((err) => err);
};

export const read = (productId) => {
  return fetch(`${API}/product/${productId}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .catch((err) => err);
};

export const listRelatedProduct = (productId) => {
  return fetch(`${API}/products/related/${productId}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .catch((err) => err);
};
