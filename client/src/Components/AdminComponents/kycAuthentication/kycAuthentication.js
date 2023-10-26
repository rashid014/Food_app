// KycAuthentication.js

import React, { useEffect } from 'react';
import axios from 'axios';
import styles from './kycAuthentication.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { setKycSubmissions, approveKycSubmission, validateKycSubmission } from '../../../Redux/kycSlice';
import SideNavbar from '../SideNav/SideNavbar';
import AdminHeader from '../Header/AdminHeader';
const KycAuthentication = () => {
  const dispatch = useDispatch();
  const kycList = useSelector((state) => state.kyc.kycSubmissions);
  const kycValidatedIds = useSelector((state) => state.kyc.kycValidatedIds);

  const fetchKycSubmissions = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/kyc-submissions');
      dispatch(setKycSubmissions(response.data.kycSubmissions));
    } catch (error) {
      console.error('Error fetching KYC submissions:', error);
    }
  };
  const approvedKycIds = useSelector((state) => state.kyc.approvedKycIds);
  const approveKyc = async (id) => {
    try {
      await axios.put(`http://localhost:4000/api/approve-kyc/${id}`);
      dispatch(approveKycSubmission(id));

      // Update localStorage with the latest approvedKycIds
      const updatedApprovedKycIds = [...approvedKycIds, id];
      localStorage.setItem('approvedKycIds', JSON.stringify(updatedApprovedKycIds));
      validateKyc(id);

      // Update local storage with KYC validation status
      localStorage.setItem(`kycValidationStatus_${id}`, 'Validated');
    } catch (error) {
      console.error('Error approving KYC:', error);
    }
  };

  const rejectKyc = async (id) => {
    try {
      await axios.put(`http://localhost:4000/api/reject-kyc/${id}`);
    } catch (error) {
      console.error('Error rejecting KYC:', error);
    }
  };

  const validateKyc = async (id) => {
    try {
      await axios.put(`http://localhost:4000/api/validate-kyc/${id}`);
      dispatch(validateKycSubmission(id));

      // Update local storage with KYC validation status
      localStorage.setItem(`kycValidationStatus_${id}`, 'Validated');
    } catch (error) {
      console.error('Error validating KYC:', error);
    }
  };

  useEffect(() => {
    fetchKycSubmissions();

    // Initialize KYC validation status from local storage
    kycList.forEach((kyc) => {
      const validationStatus = localStorage.getItem(`kycValidationStatus_${kyc._id}`);
      if (validationStatus === 'Validated') {
        dispatch(validateKycSubmission(kyc._id));
      }
    });
  }, [dispatch, kycList]);

  return (
    <div className={styles['kyc-container']}>
      <AdminHeader/>
      <div>
      <h2 className={styles['kyc-heading']}>Admin Approval Page</h2>
      </div>
      <div className="horizontal-container">
        <SideNavbar />
     
      <div className={styles['table-container']}>
        <table className={styles['kyc-table']}>
          <thead>
            <tr>
              <th>Restaurant Name</th>
              <th>PAN Card</th>
              <th>GST Number</th>
              <th>ID Proof</th>
              <th>FSSAI Number</th>
              <th>Bank Holder Name</th>
              <th>Bank Name</th>
              <th>IFSC Code</th>
              <th>Account Number</th>
              <th>KYC Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {kycList.length > 0 &&
              kycList.map((kyc) => (
                <tr key={kyc._id}>
                  <td>{kyc.restaurantName}</td>
                  <td>{kyc.panCard}</td>
                  <td>{kyc.gstNumber}</td>
                  <td>
                    <a href={kyc.idProof} target="_blank" rel="noopener noreferrer">
                      View ID Proof
                    </a>
                  </td>
                  <td>{kyc.fssaiNumber}</td>
                  <td>{kyc.bankHolderName}</td>
                  <td>{kyc.bankName}</td>
                  <td>{kyc.ifsc}</td>
                  <td>{kyc.accountNumber}</td>
                  <td>
                    {kycValidatedIds.includes(kyc._id) ? (
                      'Validated ✔'
                    ) : (
                      kyc.isApproved ? (
                        <span className={styles['approved-status']}>Approved ✔</span>
                      ) : (
                        <span className={styles['rejected-status']}>Rejected ✘</span>
                      )
                    )}
                  </td>
                  <td>
                    {kycValidatedIds.includes(kyc._id) ? (
                      'Approved ✔'
                    ) : (
                      <>
                        <button className={styles['approve-btn']} onClick={() => approveKyc(kyc._id)}>
                          Approve
                        </button>
                        <button className={styles['reject-btn']} onClick={() => rejectKyc(kyc._id)}>
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};

export default KycAuthentication;
