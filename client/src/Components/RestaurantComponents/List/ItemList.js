// ItemList.js
import React from 'react';

const ItemList = ({ items }) => {
  return (
    <div>
      <h2>Items</h2>
      <ul>
        {items.map((item) => (
          <li key={item._id}>
            <img src={`http://localhost:4000/${item.image}`} alt={item.name} />
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemList;
