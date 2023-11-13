import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance'
const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    vehicle: '',
    idProofJpg: '', // This field will be set automatically by the file input
    address: '',
    vehicleNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const navigate=useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    // Access the selected file and set it in the formData
    const file = e.target.files[0];
    setFormData({ ...formData, idProofJpg: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear any previous errors

    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: 'Password and confirm password do not match' });
      return;
    }

    try {
      // Create a FormData object to send the form data with the file
      const formDataToSubmit = new FormData();
      for (const key in formData) {
        formDataToSubmit.append(key, formData[key]);
      }

      // Make a POST request to your backend to create a new delivery partner
      await axiosInstance.post('/api/partnersignup', formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set content type for file upload
        },
      });

      console.log('Delivery partner created successfully');
      navigate('/partnerlogin')
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data); // Display server-side validation errors
      } else {
        console.error('Error creating delivery partner:', error);
      }
    }
  };

  return (
    <div>
      <h2>Signup as a Delivery Partner</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        {errors.name && <p className="error">{errors.name}</p>}

        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        {errors.email && <p className="error">{errors.email}</p>}

        <div>
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        {errors.phone && <p className="error">{errors.phone}</p>}

        <div>
          <label>Vehicle:</label>
          <input
            type="text"
            name="vehicle"
            value={formData.vehicle}
            onChange={handleChange}
            required
          />
        </div>
        {errors.vehicle && <p className="error">{errors.vehicle}</p>}

        <div>
          <label>ID Proof Image (JPG):</label>
          <input
            type="file"
            name="idProofJpg"
            accept=".jpg"
            onChange={handleFileChange}
            required
          />
        </div>
        {errors.idProofJpg && <p className="error">{errors.idProofJpg}</p>}

        <div>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        {errors.address && <p className="error">{errors.address}</p>}

        <div>
          <label>Vehicle Number:</label>
          <input
            type="text"
            name="vehicleNumber"
            value={formData.vehicleNumber}
            onChange={handleChange}
            required
          />
        </div>
        {errors.vehicleNumber && <p className="error">{errors.vehicleNumber}</p>}

        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {errors.password && <p className="error">{errors.password}</p>}

        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        {errors.confirmPassword && (
          <p className="error">{errors.confirmPassword}</p>
        )}

        <div>
          <button type="submit">Sign Up</button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
