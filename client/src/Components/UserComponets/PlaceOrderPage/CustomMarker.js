import React from 'react';

const CustomMarker = () => {
  return (
    <div>
      <svg
        height="30"
        viewBox="0 0 24 24"
        width="30"
        xmlns="http://www.w3.org/2000/svg"
        fill="red" // Customize the color
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M12 2c-5.52 0-10 4.48-10 10 0 8 10 12 10 12s10-4 10-12c0-5.52-4.48-10-10-10zm0 14c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
      </svg>
    </div>
  );
};

export default CustomMarker;
