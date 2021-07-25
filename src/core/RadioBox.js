import React, { Fragment, useState } from "react";

const RadioBox = ({ prices, handleFilters }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event) => {
    handleFilters(event.target.value);
    setValue(event.target.value);
  };

  return prices.map((p, i) => (
    <div key={i} className="list-unstyled">
      <input
        onChange={handleChange}
        name={p}
        value={`${p._id}`}
        type="radio"
        className="mr-2 ml-4"
      />
      <label className="from-check-label">{p.name}</label>
    </div>
  ));
};

export default RadioBox;
