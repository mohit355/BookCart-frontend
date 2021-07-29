import { API } from "../config";
import Product from "../core/Product";

export const addItem = (item, next) => {
  let cart = [];
  if (typeof window != "undefined") {
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    }
    cart.push({ ...item, count: 1 });

    // remove duplicates
    // Build an array from new set and turn them back to array using Array.from
    // so that later we can remap it
    // new set will allow only unique in it
    // so pass the ids of each object/product
    // If the loop tries to add the same value again, it will get ignored
    // ...with the array of ids we got on when first map() was used
    // run map on it again and return the actual product from the cart

    cart = Array.from(new Set(cart.map((p) => p._id))).map((id) => {
      return cart.find((p) => p._id === id);
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    next();
  }
};

export const itemTotal = () => {
  if (typeof window != "undefined") {
    if (localStorage.getItem("cart")) {
      return JSON.parse(localStorage.getItem("cart")).length;
    }
  }
};

export const getCartItem = () => {
  if (typeof window != "undefined") {
    if (localStorage.getItem("cart")) {
      return JSON.parse(localStorage.getItem("cart"));
    }
  }
  return [];
};

export const updateItem = (productId, count) => {
  let cart = [];
  if (typeof window != "undefined") {
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    }

    cart.map((product, index) => {
      if (productId === product._id) {
        cart[index].count = count;
      }
    });
    localStorage.setItem("cart", JSON.stringify(cart));
  }
};

export const removeItem = (productId) => {
  let cart = [];
  if (typeof window != "undefined") {
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    }

    cart.map((product, index) => {
      if (productId === product._id) {
        cart.splice(index, 1);
      }
    });
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  return cart;
};

export const emptyCart = (next) => {
  if (typeof window != "undefined") {
    localStorage.removeItem("cart");
  }
  next();
};

// Create  order

export const createOrder = (userId, token, orderData) => {
  return fetch(`${API}/order/create/${userId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};
