// AdminDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PartnerApproval.css'
import SideNavbar from '../SideNav/SideNavbar';
import AdminHeader from '../Header/AdminHeader';
const AdminDashboard = () => {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    // Fetch all submissions from the server when the component mounts
    axios.get('http://localhost:4000/api/admin/submissions').then((response) => {
      setSubmissions(response.data);
    });
  }, []);

  const handleApprove = async (submissionId) => {
    try {
  
      await axios.post(`http://localhost:4000/api/admin/approve/${submissionId}`);
  
      axios.get('http://localhost:4000/api/admin/submissions').then((response) => {
        setSubmissions(response.data);
      });
    } catch (error) {
      console.error('Error approving submission:', error);
    }
  };


  const handleReject = async (submissionId) => {
    try {

      await axios.post(`http://localhost:4000/api/admin/reject/${submissionId}`);
      axios.get('http://localhost:4000/api/admin/submissions').then((response) => {
        setSubmissions(response.data);
      });
    } catch (error) {
      console.error('Error rejecting submission:', error);
    }
  };

  return (
    <div>
       <AdminHeader/>
      <div className="horizontal-container">
        <SideNavbar />
      
      <h2>Admin Dashboard</h2>
      
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Vehicle</th>
            <th>Veh.no.</th>
            <th>adress</th>
           
            <th>Action</th>
            
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <tr key={submission._id}>
              <td>{submission.name}</td>
              <td>{submission.email}</td>
              <td>{submission.vehicle}</td>
              <td>{submission.address}</td>
              <td>{submission.vehicleNumber}</td>
             
              <td>
                <button onClick={() => handleApprove(submission._id)}>Approve</button>
                <button onClick={() => handleReject(submission._id)}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default AdminDashboard;
