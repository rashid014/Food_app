import React, { useState } from 'react';
import './kyc.css';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RestaurantHeader from '../RestaurantHeader/RestaurantHeader';
import axiosInstance from '../../../utils/axiosInstance'

const Unique2KycPage = () => {
  const [formData, setFormData] = useState({
    restaurantName: '',
    panCard: '',
    gstNumber: '',
    idProof: null, // File input
    fssaiNumber: '',
    bankHolderName: '',
    bankName: '',
    ifsc: '',
    accountNumber: '',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { restaurantId } = useParams(); // Get restaurantId from the URL
  const [isKycApproved, setIsKycApproved] = useState(false);

  useEffect(() => {
    console.log('Restaurant ID:', restaurantId);
    // Check KYC status from the server
    axiosInstance.get(`/api/kyc-status/${restaurantId}`)
      .then((response) => {
        const { isApproved } = response.data;
        setIsKycApproved(isApproved);
      })
      .catch((error) => {
        console.error('Error checking KYC status:', error);
      });
  }, [restaurantId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear the error for the field being changed
    setErrors({
      ...errors,
      [name]: '',
    });
  };

  const handleIdProofUpload = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      idProof: file,
    });
    // Clear the error for the file input
    setErrors({
      ...errors,
      idProof: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};

    // Validate each field here
    if (!formData.restaurantName.trim()) {
      validationErrors.restaurantName = 'Restaurant Name is required';
    }

    if (!formData.panCard.trim()) {
      validationErrors.panCard = 'Pan Card is required';
    }

    if (!formData.gstNumber.trim()) {
      validationErrors.gstNumber = 'GST Number is required';
    }

    if (!formData.idProof) {
      validationErrors.idProof = 'ID Proof is required';
    }

    if (!formData.fssaiNumber.trim()) {
      validationErrors.fssaiNumber = 'FSSAI Number is required';
    }

    if (!formData.bankHolderName.trim()) {
      validationErrors.bankHolderName = 'Bank Holder Name is required';
    }

    if (!formData.bankName.trim()) {
      validationErrors.bankName = 'Bank Name is required';
    }

    if (!formData.ifsc.trim()) {
      validationErrors.ifsc = 'IFSC Code is required';
    }

    if (!formData.accountNumber.trim()) {
      validationErrors.accountNumber = 'Account Number is required';
    }

    setErrors(validationErrors);

    // Check if there are any validation errors
    if (Object.keys(validationErrors).length === 0) {
      try {
        console.log('restaurantId:', restaurantId);
        const response = await axiosInstance.post(`/api/submit-kyc/${restaurantId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('KYC submission successful:', response.data);

        // Redirect to /redirectwait if KYC is not approved
        if (!isKycApproved) {
          navigate(`/redirectwait/${restaurantId}`);
        } else {
          // KYC is approved, redirect to home page
          navigate(`/restaurantHome/${restaurantId}`);
        }
      } catch (error) {
        console.error('Error submitting KYC:', error);
      }
    }
  };

  return (
    <div classname="unique-navbar">
     <RestaurantHeader />
     <div>
    <div className="unique2-kyc-page">
     
      <h2>KYC Information</h2>
      <form onSubmit={handleSubmit}>
        {/* Restaurant Information */}
        <div className="unique2-form-group">
          <label htmlFor="unique2-restaurantName">Restaurant Name:</label>
          <input
            type="text"
            id="unique2-restaurantName"
            name="restaurantName"
            value={formData.restaurantName}
            onChange={handleChange}
            required
          />
          {errors.restaurantName && <div className="unique2-error-message">{errors.restaurantName}</div>}
        </div>
        <div className="unique2-form-group">
          <label htmlFor="unique2-panCard">Pan Card:</label>
          <input
            type="text"
            id="unique2-panCard"
            name="panCard"
            value={formData.panCard}
            onChange={handleChange}
            required
          />
          {errors.panCard && <div className="unique2-error-message">{errors.panCard}</div>}
        </div>
        <div className="unique2-form-group">
          <label htmlFor="unique2-gstNumber">GST Number:</label>
          <input
            type="text"
            id="unique2-gstNumber"
            name="gstNumber"
            value={formData.gstNumber}
            onChange={handleChange}
            required
          />
          {errors.gstNumber && <div className="unique2-error-message">{errors.gstNumber}</div>}
        </div>
        <div className="unique2-form-group">
          <label htmlFor="unique2-idProof">ID Proof Upload (JPG only):</label>
          <input
            type="file"
            id="unique2-idProof"
            accept=".jpg"
            onChange={handleIdProofUpload}
            required
          />
          {errors.idProof && <div className="unique2-error-message">{errors.idProof}</div>}
        </div>
        <div className="unique2-form-group">
          <label htmlFor="unique2-fssaiNumber">FSSAI Number:</label>
          <input
            type="text"
            id="unique2-fssaiNumber"
            name="fssaiNumber"
            value={formData.fssaiNumber}
            onChange={handleChange}
            required
          />
          {errors.fssaiNumber && <div className="unique2-error-message">{errors.fssaiNumber}</div>}
        </div>
        {/* Bank Information */}
        <div className="unique2-form-group">
          <label htmlFor="unique2-bankHolderName">Bank Holder Name:</label>
          <input
            type="text"
            id="unique2-bankHolderName"
            name="bankHolderName"
            value={formData.bankHolderName}
            onChange={handleChange}
            required
          />
          {errors.bankHolderName && <div className="unique2-error-message">{errors.bankHolderName}</div>}
        </div>
        <div className="unique2-form-group">
          <label htmlFor="unique2-bankName">Bank Name:</label>
          <input
            type="text"
            id="unique2-bankName"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            required
          />
          {errors.bankName && <div className="unique2-error-message">{errors.bankName}</div>}
        </div>
        <div className="unique2-form-group">
          <label htmlFor="unique2-ifsc">IFSC Code:</label>
          <input
            type="text"
            id="unique2-ifsc"
            name="ifsc"
            value={formData.ifsc}
            onChange={handleChange}
            required
          />
          {errors.ifsc && <div className="unique2-error-message">{errors.ifsc}</div>}
        </div>
        <div className="unique2-form-group">
          <label htmlFor="unique2-accountNumber">Account Number:</label>
          <input
            type="text"
            id="unique2-accountNumber"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            required
          />
          {errors.accountNumber && <div className="unique2-error-message">{errors.accountNumber}</div>}
        </div>
        {/* Submit button */}
        <button type="submit">Submit KYC</button>
      </form>
    </div>
    </div>
    </div>
  );
};

export default Unique2KycPage;
