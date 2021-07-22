import React, { useState } from "react";

const Checkbox = ({ categories, handleFilters }) => {
  const [checked, setChecked] = useState([]);

  const handleToggle = (event) => {
    const currentCategoryId = checked.indexOf(event.target.name); // first index or -1
    const newCheckedCategoryId = [...checked];
    // if currently checked was not in the  checked state > push else pull

    if (currentCategoryId === -1) {
      newCheckedCategoryId.push(event.target.name);
    } else {
      newCheckedCategoryId.splice(currentCategoryId, 1);
    }
    setChecked(newCheckedCategoryId);
    handleFilters(newCheckedCategoryId);
  };

  return categories.map((c, i) => (
    <li key={i} className="list-unstyled">
      <input
        onChange={handleToggle}
        name={c._id}
        value={checked.indexOf(c._id === -1)}
        type="checkbox"
        className="form-check-input"
      />
      <label className="from-check-label">{c.name}</label>
    </li>
  ));
};

export default Checkbox;
