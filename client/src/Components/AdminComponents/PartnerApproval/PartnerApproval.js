import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PartnerApproval.css';
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
      await axios.post(`http://localhost:4000/api/admin/reject/${submissionId}`);

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
        <h2>Admin Dashboard</h2>
        </div>
      <div className="horizontal-container">
     
        <SideNavbar />

        <table>
      
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Vehicle</th>
              <th>Veh.no.</th>
              <th>Address</th>
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
                  {submission.isApproved ? (
                    <span className="approved">
                      Approved <i className="fa fa-check" />
                    </span>
                  ) : submission.isRejected ? (
                    <span className="rejected">Rejected</span>
                  ) : (
                    <div>
                      <button onClick={() => handleApprove(submission._id)}>Approve</button>
                      <button onClick={() => handleReject(submission._id)}>Reject</button>
                    </div>
                  )}
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
