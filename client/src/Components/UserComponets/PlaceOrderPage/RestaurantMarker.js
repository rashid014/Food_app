import React from 'react';
const CustomMarker = () => {
  return (
    <div style={{ width: '30px', height: '30px' }}>
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGZAVcANtBllDy3YMfejFiEeoDDe0TkKQ-8g&usqp=CAU" // Replace with the path to your restaurant icon image
        alt="Restaurant Icon"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default CustomMarker;
