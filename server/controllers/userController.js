const express = require('express');
const User = require('../model/userMode');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const fs = require('fs')
const directoryPath = 'public/'
const nodemailer = require('nodemailer');
const OTP = require('../model/Otp');
const Razorpay = require('razorpay');
require('dotenv').config();
const Order= require('../model/Order')
const createRazorpayOrder=require('../controllers/razorPayController')
const mongoose=require('mongoose')

const OtpPhone = require('../model/phoneOtp');
const sendSMS = require('../util/sendSMS'); // Implement sending SMS logic


module.exports = {
  userSignup: async (req, res) => {
    try {
        let userEmail = req.body.email;
        let userPhoneNumber = req.body.phoneNumber;
        const existingUser = await User.findOne({ $or: [{ email: userEmail }, { phoneNumber: userPhoneNumber }] });
        
        if (existingUser) {
            if (existingUser.email === userEmail) {
                res.json({ status: "userRegistered", error: "Email already registered" });
            } else if (existingUser.phoneNumber === userPhoneNumber) {
                res.json({ status: "userRegistered", error: "Phone number already registered" });
            }
        } else {
            const hashPassword = await bcrypt.hash(req.body.password, 10);
            const user = await User.create({
                userName: req.body.userName,
                email: req.body.email,
                password: hashPassword,
                phoneNumber: req.body.phoneNumber,
            });
            res.json({ status: "ok", _id: user._id, name: user.userName });
        }
    } catch (err) {
        console.log("err", err);
        res.json({ status: 'error', error: "An error occurred" });
    }
},



    userLogin: async (req, res) => {
        try {

            const user1 = await User.findOne({ email: req.body.email })

            if (user1) {

                const passwordValid = await bcrypt.compare(req.body.password, user1.password)
                if (passwordValid) {

                    const token = jwt.sign({
                        name: user1.userName,
                        email: user1.email,
                        id: user1._id
                    },
                        'secret123',
                        {
                            expiresIn: "7d"
                        }
                    )

                    res.json({ status: 'ok', message: "Login Sucess", token: token, user:user1 })
                } else {
                    console.log("user details invalid");
                    res.json({ status: 'error', error: 'userdetails invalid', user: false })

                }
            } else {
                res.json({ status: 'error', error: 'User Not found' })
            }

        } catch (err) {
            res.json({ status: 'error', error: "oops catch error" })
            console.log(err)
        }
    },

    verifyToken: async (req, res) => {
        try {

            const decodedToken = jwt.verify(req.body.Token, 'secret123')
            const user = await User.findOne({ email: decodedToken.email });

            if (user.image) {
                user.image = `http://localhost:4000/${user.image}`
            }
            else {
                user.image = `https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png`
            }

            return res.status(200).json({ message: "token valid", user, token: true });



        } catch (err) {
            res.json({ status: 'error', error: "invalid token", token: false })
        }
    },
    

    userImageUpdate: async (req, res) => {
        try {
            let Token = req.params.id;
            let token2 = JSON.parse(Token)
            console.log(token2, "this is the Token")
            const decodedToken = jwt.verify(token2, 'secret123');
            console.log(decodedToken)
            const user = await User.findOne({ _id: decodedToken.id });
            if (user) {
              


                const update = await User.updateOne({ _id: decodedToken.id }, {
                    $set: {
                        image: req.files.image[0].filename
                    }
                })
                const image = `http://localhost:4000/${req.files.image[0].filename}`                
                return res.status(200).json({ message: "user found", image });
            }
            else {
                return res.json({ status: "error", message: "photo coubldint updaete" })
            }

        } catch (err) {
            console.log(err, "this oneis catch photot")
            res.json({ status: "error", message: "photo catch error" })
        }
    },


    //     updateUserProfile:async(req, res) =>{
    //     try {
    //       const { userId } = req.params;
    //       const { name, email } = req.body;
      
    //       // Verify the JWT token in the request header
    //       const token = req.headers.authorization.split(' ')[1];
    //       const decodedToken = jwt.verify(token, 'secret123');
      
    //       // Ensure the user ID in the token matches the request user ID
    //       if (decodedToken.id !== userId) {
    //         return res.status(403).json({ message: 'Unauthorized' });
    //       }
      
    //       // Find the user by userId and update the profile
    //       const updatedUser = await User.findByIdAndUpdate(
    //         userId,
    //         { name, email },
    //         { new: true }
    //       );
      
    //       res.json(updatedUser);
    //     } catch (error) {
    //       console.error(error);
    //       res.status(500).json({ message: 'Internal server error' });
    //     }
    //   },
    updateName: async (req, res) => {
        try {
          const { userName } = req.body;
          const { authorization } = req.headers;
      
          // Check if 'userName' is provided in the request body
          if (!userName) {
            return res.status(400).json({ success: false, message: 'userName is required' });
          }
      
          // Verify the JWT token to get the user's ID
          const decodedToken = jwt.verify(authorization, 'secret123');
          const userId = decodedToken.id;
      
          // Find the user by userId and update the 'userName' field
          const updatedUser = await User.findByIdAndUpdate(
            userId,
            { userName }, // Only update 'userName'
            { new: true }
          );
      
          return res.json({ success: true, user: updatedUser });
        } catch (error) {
          console.error('Error updating name:', error);
          res.status(500).json({ success: false, message: 'Internal server error' });
        }
      },
      
    
      
   
      updateEmail: async (req, res) => {
        try {
          const { email } = req.body;
      
          // Get user ID from the JWT token
          const decodedToken = jwt.verify(req.headers.authorization, 'secret123');
          const userId = decodedToken.id;
      
          // Find the user by userId
          const user = await User.findById(userId);
      
          if (!user) {
            return res.status(400).json({ success: false, message: 'User not found' });
          }
      
          // Generate a new OTP
          const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
          // Create a transporter for sending email notifications
          const transporter = nodemailer.createTransport({
            service: 'gmail', // Use your email service
            auth: {
              user: process.env.GMAIL, // Your Gmail email
              pass: process.env.PASSWORD, // Your Gmail password
            },
          });
      
          // Send an email notification to the user's new email address
          const mailOptions = {
            from: process.env.GMAIL, // Your Gmail email
            to: email, // New email address
            subject: 'Email Verification OTP',
            text: `Your OTP is: ${otp}`,
          };
      
          transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
              console.error('Error sending email:', error);
              res.status(500).json({ success: false, message: 'Failed to send verification email' });
            } else {
              console.log('Email sent: ' + info.response);
      
              // Store the OTP in the database
              const newOTP = new OTP({
                email,
                otp,
                expires: new Date(Date.now() + 10 * 60 * 1000), // OTP expires in 10 minutes
              });
              await newOTP.save();
      
              res.json({ success: true, message: 'OTP sent successfully' });
            }
          });
        } catch (error) {
          console.error('Error sending OTP:', error);
          res.status(500).json({ success: false, message: 'Internal server error' });
        }
      },
      
      
    // otpController.js

   sendOTP : async (req, res) => {
  const { phoneNumber } = req.body;

  // Generate a random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // Save the OTP and phone number in the database
    const otpData = new OtpPhone({
      phoneNumber,
      otp,
    });

    await otpData.save();

    // Send the OTP to the user via SMS (implement this part)
    sendSMS(phoneNumber, `Your OTP: ${otp}`);

    res.json({ sent: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
},

// Import necessary modules and models


verifyOTP1: async (req, res) => {
  try {
    const { otp } = req.body; // Get the OTP from the request body

    const decodedToken = jwt.verify(req.headers.authorization, 'secret123');
    const userId = decodedToken.id;

    // Find the user by userId
    const user = await User.findById(userId);
    console.log("userid"+user.email)
    // Find the latest OTP record associated with the user's email
    const latestOTP = await OTP.findOne({
      email: user.email, // Assuming user.email is correctly populated in req.user
    }).sort({ createdAt: -1 });
    
  console.log("otp"+latestOTP)
  

    // Handle OTP verification success
    res.json({ success: true, message: 'OTP Verified Successfully', email: latestOTP.email });

    // Optionally, you can delete the used OTP record to prevent re-use
    await latestOTP.remove();
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
,
  

verifyOTP :async (req, res) => {
  const { phoneNumber, otp } = req.body;

  try {
    // Check if the OTP exists in the database
    const otpData = await OtpPhone.findOne({ phoneNumber, otp });

    if (otpData) {
      // Valid OTP, let's find the user associated with the phone number
      const user = await User.findOne({ phoneNumber });

      if (user) {
        // Generate a JWT token
        const token = jwt.sign(
          {
            name: user.userName, // Add the appropriate user fields
            email: user.email,
            id: user._id,
            phoneNumber: user.phoneNumber,
          },
          'secret123',
          {
            expiresIn: '7d',
          }
        );

        // Optionally, you can delete the used OTP here
        await otpData.remove();

        res.json({ valid: true, token });
      } else {
        // User not found for this phone number
        res.json({ valid: false, error: 'User not found' });
      }
    } else {
      // Invalid OTP
      res.json({ valid: false, error: 'Invalid OTP' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
},




placeOrder: async (req, res) => {
  try {
    const token = req.headers.authorization; // Extract the token from the Authorization header

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verify the token
    const decodedToken = jwt.verify(token, 'secret123'); // Replace 'your-secret-key' with your actual secret key
    const userId = decodedToken.id;

    const restaurantId = mongoose.Types.ObjectId(req.body.restaurantId);

    const {
      items, // cart items
      deliveryAddress,
      deliveryCharge,
      tax,
      totalAmount,
      customerName,
      contactNumber,
      paymentMethod,
      subtotal,
      restaurantName,
      
      // Receive restaurantName from the request body
    } = req.body;

    // Create a new order
    const order = new Order({
      user: userId,
      restaurantId: restaurantId,
      restaurantName: restaurantName, // Assign the received restaurantName to the order
      cart: items, // cart items
      deliveryAddress,
      deliveryCharge,
      tax,
      totalAmount,
      customerName,
      contactNumber,
      paymentMethod,
      subtotal,
     
    });

    // Save the order
    await order.save();

    // Generate the orderId
    const orderId = order._id; // Assuming your order model uses '_id' as the primary key
    await User.findByIdAndUpdate(userId, { $push: { orders: orderId } });

    return res.status(201).json({ message: 'Order placed successfully', orderId });
  } catch (error) {
    console.error('Error placing order:', error);
    return res.status(500).json({ message: 'Failed to place the order' });
  }
},



   getOrderDetails : async (req, res) => {
  try {
    const { orderId } = req.params;

    // Fetch order details by orderId
    const orderDetails = await Order.findById(orderId);

    if (!orderDetails) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(200).json(orderDetails);
  } catch (error) {
    console.error('Error fetching order details:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
},



}
