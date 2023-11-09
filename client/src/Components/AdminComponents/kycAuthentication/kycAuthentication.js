// KycAuthentication.js

import React, { useEffect } from 'react';
import axios from 'axios';
import styles from './kycAuthentication.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { setKycSubmissions, approveKycSubmission, validateKycSubmission } from '../../../Redux/kycSlice';
import SideNavbar from '../SideNav/SideNavbar';
import AdminHeader from '../Header/AdminHeader';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button'; 
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
    <div>
       <AdminHeader/>
    <div className={styles['kyc-container']}>
     
      <div>
      <h2 className={styles['kyc-heading']}>Admin Approval Page</h2>
      </div>
      <div className="horizontal-container">
        <SideNavbar />
     
      <div className={styles['table-container']}>
      <TableContainer component={Paper}>
      <Table style={{ border: '2px solid black' ,marginBottom:350}}>
        <TableHead>
          <TableRow>
            <TableCell>Restaurant Name</TableCell>
            <TableCell>PAN Card</TableCell>
            <TableCell>GST Number</TableCell>
            <TableCell>ID Proof</TableCell>
            <TableCell>FSSAI Number</TableCell>
            <TableCell>Bank Holder Name</TableCell>
            <TableCell>Bank Name</TableCell>
            <TableCell>IFSC Code</TableCell>
            <TableCell>Account Number</TableCell>
            <TableCell>KYC Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {kycList.length > 0 &&
            kycList.map((kyc) => (
              <TableRow key={kyc._id}>
                <TableCell>{kyc.restaurantName}</TableCell>
                <TableCell>{kyc.panCard}</TableCell>
                <TableCell>{kyc.gstNumber}</TableCell>
                <TableCell>
                  <a href={kyc.idProof} target="_blank" rel="noopener noreferrer">
                    View ID Proof
                  </a>
                </TableCell>
                <TableCell>{kyc.fssaiNumber}</TableCell>
                <TableCell>{kyc.bankHolderName}</TableCell>
                <TableCell>{kyc.bankName}</TableCell>
                <TableCell>{kyc.ifsc}</TableCell>
                <TableCell>{kyc.accountNumber}</TableCell>
                <TableCell>
                  {kycValidatedIds.includes(kyc._id) ? (
                    'Validated ✔'
                  ) : kyc.isApproved ? (
                    <span style={{ color: 'green' }}>Approved ✔</span>
                  ) : (
                    <span style={{ color: 'red' }}>Rejected ✘</span>
                  )}
                </TableCell>
                <TableCell>
                  {kycValidatedIds.includes(kyc._id) ? (
                    'Approved ✔'
                  ) : (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => approveKyc(kyc._id)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => rejectKyc(kyc._id)}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
      </div>
    </div>
    </div>
    </div>
  );
};

export default KycAuthentication;
