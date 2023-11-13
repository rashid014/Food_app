import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PartnerApproval.css';
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
import axiosInstance from '../../../utils/axiosInstance'

const AdminDashboard = () => {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    // Fetch all submissions from the server when the component mounts
    axiosInstance.get('/api/admin/submissions').then((response) => {
      setSubmissions(response.data);
    });
  }, []);

  const handleApprove = async (submissionId) => {
    try {
      await axiosInstance.post(`/api/admin/approve/${submissionId}`);

      // Update the submission status to "Approved" locally
      setSubmissions((prevSubmissions) =>
        prevSubmissions.map((submission) =>
          submission._id === submissionId ? { ...submission, isApproved: true } : submission
        )
      );
    } catch (error) {
      console.error('Error approving submission:', error);
    }
  };

  const handleReject = async (submissionId) => {
    try {
      await axiosInstance.post(`/api/admin/reject/${submissionId}`);

      // Update the submission status to "Rejected" locally
      setSubmissions((prevSubmissions) =>
        prevSubmissions.map((submission) =>
          submission._id === submissionId ? { ...submission, isRejected: true } : submission
        )
      );
    } catch (error) {
      console.error('Error rejecting submission:', error);
    }
  };

  return (
    <div>
      <AdminHeader />
      <div classname="real" >
        <h2>Partner Approval</h2>
        </div>
      <div className="horizontal-container">
     
        <SideNavbar />
        
    <TableContainer component={Paper}>
    <Table style={{ border: '2px solid black' ,marginBottom:350,margin:5}}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Vehicle</TableCell>
            <TableCell>Vehicle No.</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow key={submission._id}>
              <TableCell>{submission.name}</TableCell>
              <TableCell>{submission.email}</TableCell>
              <TableCell>{submission.vehicle}</TableCell>
              <TableCell>{submission.vehicleNumber}</TableCell>
              <TableCell>{submission.address}</TableCell>
              <TableCell>
                {submission.isApproved ? (
                  <span style={{ color: 'green' }}>
                    Approved <i className="fa fa-check" />
                  </span>
                ) : submission.isRejected ? (
                  <span style={{ color: 'red' }}>Rejected</span>
                ) : (
                  <div>
                    <Button variant="contained" color="primary" onClick={() => handleApprove(submission._id)}>
                      Approve
                    </Button>
                    <Button variant="contained" color="error" onClick={() => handleReject(submission._id)}>
                      Reject
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
      </div>
    </div>
    
  );
};

export default AdminDashboard;
