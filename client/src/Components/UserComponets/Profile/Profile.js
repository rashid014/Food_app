import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { imageUpload, verifyUserToken } from '../../../utils/Constants';
import { changeImage } from '../../../Redux/userimageReducer';
import { change, changeEmail } from '../../../Redux/usernameReducer'; // Import the new actions
import axios from '../../../utils/axios';
import Header from '../Home/Header';
import axiosInstance from '../../../utils/axiosInstance'
import Swal from 'sweetalert2';
import './Profile.css';

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userImage = useSelector((state) => state.userImage);
  const { name, email } = useSelector((state) => state.userProfile);

  const [updatedName, setUpdatedName] = useState(name);
  const [updatedEmail, setUpdatedEmail] = useState(email);
  const [showOTPForm, setShowOTPForm] = useState(false); // State to control OTP form visibility
  const [otp, setOTP] = useState('');

  useEffect(() => {
    const Token = localStorage.getItem('token');

    if (!Token) {
      navigate('/');
    } else {
      const body = JSON.stringify({ Token });
      axios.post(verifyUserToken, body, { headers: { 'Content-Type': 'application/json' } }).then((res) => {
        dispatch(change(res.data.user.userName));
        dispatch(changeEmail(res.data.user.email));
        dispatch(changeImage(res.data.user.image));
      });
    }
  }, [navigate, dispatch]);

  const handleNameChange = (event) => {
    setUpdatedName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setUpdatedEmail(event.target.value);
  };

  const handleSaveName = () => {
    const trimmedName = updatedName.trim(); // Remove leading and trailing spaces
    if (trimmedName) {
      const Token = localStorage.getItem('token');
      axiosInstance
        .put(
          '/update/name',
          { userName: trimmedName, Token: Token },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: localStorage.getItem('token'),
            },
          }
        )
        .then((res) => {
          dispatch(change(res.data.user.userName));
          localStorage.setItem('userName', res.data.user.userName);
          console.log('Name updated successfully', res.data);
        })
        .catch((error) => {
          console.error('Error updating name:', error);
        });
    } else {
      // Show an error message for invalid input
      Swal.fire({
        icon: 'error',
        title: 'Invalid Name',
        text: 'Please enter a valid name.',
      });
    }
  };
  const handleSaveEmail = () => {
    axiosInstance
      .put(
        '/update/email',
        { email: updatedEmail },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token'),
          },
        }
      )
      .then((res) => {
        console.log('Email updated successfully', res.data);

        // After successful email update, show the OTP form for verification
        setShowOTPForm(true);

        // You can also add a success message here
        Swal.fire({
          icon: 'success',
          title: 'OTP sent to Email',
          text: 'A verification OTP has been sent to your new email address.',
        });
      })
      .catch((error) => {
        console.error('Error updating email:', error);

        // You can also show an error message
        Swal.fire({
          icon: 'error',
          title: 'Error Updating Email',
          text: 'An error occurred while updating your email. Please try again.',
        });
      });
  };

  const handleVerifyOTP = async () => {
    try {
      // Send the entered OTP to the server for verification
      const response = await axiosInstance.post('/verifyemail', { otp },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
      });
  
      if (response.data.success) {
        // If verification is successful, proceed with the email update
        const updatedEmail = response.data.email;
  
        // Update the email in the local state
        setUpdatedEmail(updatedEmail);
  
        // Clear the OTP input field
        setOTP('');
  
        // Close the OTP verification form
        setShowOTPForm(false);
  
        // Show a success message to the user
        Swal.fire({
          icon: 'success',
          title: 'OTP Verified Successfully',
          text: 'You can now login with your updated email address.',
        });
  
        // Clear the token and log the user out
        localStorage.removeItem('token');
        // You may want to navigate the user to the login page here
      } else {
        // Handle the case where OTP verification fails
        console.error('OTP verification failed:', response.data.message);
        // You can show an error message to the user
        Swal.fire({
          icon: 'error',
          title: 'OTP Verification Failed',
          text: 'The OTP entered is not valid. Please try again.',
        });
      }
    } catch (error) {
      // Handle any errors that occur during the OTP verification process
      console.error('Error verifying OTP:', error);
      // You can show an error message to the user
      Swal.fire({
        icon: 'error',
        title: 'Error Verifying OTP',
        text: 'An error occurred while verifying the OTP. Please try again.',
      });
    }
  };
  

  const addImage = async () => {
    const { value: file } = await Swal.fire({
      title: 'Select image',
      input: 'file',
      inputAttributes: {
        accept: 'image/*',
        'aria-label': 'Upload your profile picture',
      },
    });

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        Swal.fire({
          title: 'img',
          imageUrl: e.target.result,
          imageHeight: 400,
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: 'Update',
          denyButtonText: 'Change',
        }).then((result) => {
          if (result.isConfirmed) {
            uploadimg(file);
          } else if (result.isDenied) {
            addImage();
          }
        });
      };
      reader.readAsDataURL(file);
    }

    function uploadimg(file) {
      const Token2 = localStorage.getItem('token');
      let Stoken = JSON.stringify(Token2);
      let formData = new FormData();
      formData.append('image', file);
      axios.post(`${imageUpload}/${Stoken}`, formData).then((res) => {
        dispatch(changeImage(res.data.image));
      }).catch((err) => {
        console.error(err);
      });
    }
  }

  return (
    <div>
      <Header />
      <div className="container rounded bg- mt-5 mb-5 profilepage">
        <div className="row">
          <div className="col-md-4 border-right">
            <div className="d-flex flex-column align-items-center text-center p-3 py-5">
              <img className="rounded-circle mt-5" width={150} src={userImage} alt="profile photo" />
              <span className="font-weight-bold">{email}</span>
              <span className="font-weight-bold">{name}</span>
              <span className="text-black-50"></span>
              <span>
                <button onClick={addImage} type="button" className="btn btn-primary">
                  Update Image
                </button>
              </span>
            </div>
          </div>
          <div className="col-md-8 border-right">
            <div className="p-3 py-5">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="text-right">Profile Settings</h4>
              </div>
              <div className="row mt-2">
                <div className="col-md-6">
                  <label className="labels">Change Name</label>
                  <input className="form-control" value={updatedName} onChange={handleNameChange} />
                  <button onClick={handleSaveName} className="btn btn-primary mt-2">
                    Save Name
                  </button>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-6">
                  <label className="labels">Change Email</label>
                  <input className="form-control" value={updatedEmail} onChange={handleEmailChange} />
                  <button onClick={handleSaveEmail} className="btn btn-primary mt-2">
                    Save Email
                  </button>
                  {showOTPForm && (
                    <div>
                      <label className="labels">Enter OTP</label>
                      <input type="text" value={otp} onChange={(e) => setOTP(e.target.value)} />
                      <button onClick={handleVerifyOTP}>Verify OTP</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4"></div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
