import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../../utils/axios';
import './Signup.css';
import { signUpPost } from '../../../utils/Constants';
import Swal from 'sweetalert2';

function Signup() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(''); // Added phoneNumber field

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trim the input values to remove leading and trailing whitespace
    const trimmedUserName = userName.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();
    const trimmedPhoneNumber = phoneNumber.trim(); // Trimmed phoneNumber

    if (
      trimmedUserName === '' ||
      trimmedEmail === '' ||
      trimmedPassword === '' ||
      trimmedConfirmPassword === '' ||
      trimmedPhoneNumber === '' // Check if phoneNumber is empty
    ) {
      Swal.fire(
        'Please fill in all fields',
        'All fields are required',
        'warning'
      );
    } else if (trimmedPassword !== trimmedConfirmPassword) {
      Swal.fire(
        'Password mismatch',
        'Please make sure your passwords match',
        'error'
      );
    } else {
      try {
        const body = JSON.stringify({
          userName: trimmedUserName,
          email: trimmedEmail,
          password: trimmedPassword,
          phoneNumber: trimmedPhoneNumber, // Added phoneNumber to the request
        });

        let response = await axios.post(signUpPost, body, {
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.data.status === 'ok') {
          Swal.fire(
            'Good job!',
            'Signup Success!',
            'success'
          );
          console.log(response.data);
          navigate('/');
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'User Already Registered!',
          });
          console.log('User already registered');
        }
      } catch (err) {
        console.error(err);
        alert(err);
        console.log('An error occurred');
      }
    }
  };

  return (
    <div className='signInpage' style ={{height:1000}}>
      <form className='loginForm mt-5'style ={{height:850}} onSubmit={(e) => handleSubmit(e)}>
        <h3 className='tag1'>Signup</h3>
        <label className='label1' htmlFor='username'>
          User Name
        </label>
        <input
          className='input1'
          type='text'
          placeholder='User Name'
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          id='username'
        />
        <label className='label1' htmlFor='email'>
          Email
        </label>
        <input
          className='input1'
          type='text'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id='email'
        />
       
        <label className='label1' htmlFor='password'>
          Password
        </label>
        <input
          className='input1'
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id='password'
        />

        <label className='label1' htmlFor='confirmPassword'>
          Confirm Password
        </label>
        <input
          className='input1'
          type='password'
          placeholder='Confirm Password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          id='confirmPassword'
        />

        <label className='label1' htmlFor='phoneNumber'>
          Phone Number
        </label>
        <input
          className='input1'
          type='text'
          placeholder='Phone Number'
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          id='phoneNumber'
        />

        <button className='loginButton' type='submit'>
          Signup
        </button>
        <div className='social'>
          <div className='go'>
            <i className='fab fa-google'></i> <Link to={'/login'}>Login</Link>{' '}
          </div>
        </div>
      </form>
    </div>
  );
}

export default Signup;
