import React, { useEffect, useState } from 'react';
import Footer from '../Footer/Footer';
import AdminHeader from '../Header/AdminHeader';
import axios from '../../../utils/axios';
import './updateUser.css';
import { adminEditUser, adminUpdateUser } from '../../../utils/Constants';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

function UpdateUser() {
  const params = useParams();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    axios.get(`${adminEditUser}/${params.id}`)
      .then((res) => {
        console.log(res.data.userData);
        setEmail(res.data.userData.email);
        setUserName(res.data.userData.userName);
      })
      .catch((err) => {
        alert(err);
      });
  }, [params.id]);

  const updateUserDetails = async (e) => {
    e.preventDefault();
    const body = { userName: userName, email: email };

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Update it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        if (body.email === "" || body.userName === "") {
          Swal.fire(
            'Please fill in all fields.',
            'Fields cannot be empty.',
            'warning'
          );
        } else {
          axios.put(`${adminUpdateUser}/${params.id}`, body, { headers: { "Content-Type": "application/json" } })
            .then((response) => {
              console.log(response.data);
              if (response.data.success) {
                swalWithBootstrapButtons.fire(
                  'Updated!',
                  'User file has been updated.',
                  'success'
                );
                navigate('/users');
              } else if (response.data.userexists) {
                Swal.fire({
                  title: 'Oops...USER EXISTS',
                  text: "Try again with a different username or email.",
                  height: "5rem",
                });
              }
            })
            .catch((err) => {
              Swal.fire({
                title: 'Oops...',
                text: "An error occurred. Please try again.",
                height: "5rem",
              });
            });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'User update is canceled.',
          'error'
        );
      }
    });
  };

  return (
    <div>
      <AdminHeader />
      <form className='updateForm' onSubmit={(e) => updateUserDetails(e)}>
        <div className="container1">
          <h1>UPDATE USER</h1>

          <label htmlFor="username"><b>Username</b></label>
          <input
            type="text"
            placeholder="Enter username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            id="username"
            required=""
          />

          <label htmlFor="email"><b>Email</b></label>
          <input
            type="text"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            required=""
          />

          <button type="submit">Update User</button>
        </div>
      </form>
      <Footer />
    </div>
  );
}

export default UpdateUser;
