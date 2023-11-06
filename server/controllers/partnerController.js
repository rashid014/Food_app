const bcrypt = require('bcrypt');
const { DeliveryPartner } = require('../model/DeliverPartner');
const jwt = require('jsonwebtoken');
const config = require('./../config/token');
const nodemailer = require('nodemailer');
const Order=require('../model/Order')
require('dotenv').config();
exports.signup = async (req, res) => {
  try {
    const {   
      name,
      email,
      phone,
      vehicle,
      address,
      vehicleNumber,
      password,
      confirmPassword,
    } = req.body;

    // Check if the email is already registered
    const existingDeliveryPartner = await DeliveryPartner.findOne({ email });
    if (existingDeliveryPartner) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Check if the password and confirm password match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Password and confirm password do not match' });
    }

    // Hash the password before storing it
    const saltRounds = 10; // You can adjust the number of salt rounds as needed
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const idProofJpg = `/uploads/${req.file.filename}`;

    // Create a new delivery partner instance with isVerified set to false
    const newDeliveryPartner = new DeliveryPartner({
      name,
      email,
      phone,
      vehicle,
      idProofJpg,
      address,
      vehicleNumber,
      password: hashedPassword,
      confirmPassword: hashedPassword,
      isVerified: false, // Newly registered partner is not verified
    });

    // Save the delivery partner to the database
    await newDeliveryPartner.save();

    // Send a success response
    res.status(201).json({ message: 'Signup successful. Awaiting verification from admin.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



exports.listSubmissions = async (req, res) => {
  try {
    const submissions = await DeliveryPartner.find();
    res.status(200).json(submissions);
  } catch (error) {
    console.error('Error listing submissions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



// Approve a submission
exports.approveSubmission = async (req, res) => {
  const { submissionId } = req.params;
  try {
    const deliveryPartner = await DeliveryPartner.findByIdAndUpdate(submissionId, { isApproved: true });

    if (!deliveryPartner) {
      return res.status(404).json({ message: 'Delivery partner not found' });
    }

    // Send an email to the approved delivery partner
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL,
        pass:  process.env.PASSWORD,
       
      },
    });

    const mailOptions = {
      from: process.env.GMAIl,
      to: deliveryPartner.email, // Use the email field from your model
      subject: 'Approval Notification',
      text: 'Your submission has been approved. You are now a delivery partner.',
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Error sending email' });
      } else {
        console.log('Email sent:', info.response);
        return res.status(200).json({ message: 'Submission approved successfully' });
      }
    });
  } catch (error) {
    console.error('Error approving submission:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



// Reject a submission
exports.rejectSubmission = async (req, res) => {
  const { submissionId } = req.params;
  try {
    await DeliveryPartner.findByIdAndDelete(submissionId);
    res.status(200).json({ message: 'Submission rejected successfully' });
  } catch (error) {
    console.error('Error rejecting submission:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const generateToken = (partnerId, name) => {
  return jwt.sign(
    { partnerId, name },
    config.jwtSecret,
    { expiresIn: '1h' }
  );
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const partner = await DeliveryPartner.findOne({ email });

    if (!partner) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    if (!partner.isApproved) {
      return res.status(401).json({ message: 'Wait for approval' });
    }

    const isPasswordValid = await bcrypt.compare(password, partner.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    // If login is successful, include a success message
    res.status(200).json({
      message: 'Logged in successfully', // Add the success message
      token: generateToken(partner._id, partner.name),
      partnerId: partner._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};



const secretKey = 'secret123'
exports.verifyToken2 = (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token is missing.' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token is invalid or expired.' });
    }

    const { partnerId, name } = decoded; // Assuming _id is included in the token payload

    // Send a response with the restaurant information
    res.json({ partnerId, name });
  });
};

exports.getAllOrders = async (req, res) => {
  const { partnerId } = req.body; // Assuming partnerId is passed in the request

  try {
    let orders;
    if (partnerId) {
      // If partnerId is provided, fetch orders assigned to that specific partner
      orders = await Order.find({
        status: { $nin: ["Cancelled", "Rejected", "Pending"] },
        assignedDeliveryPartner: partnerId, // Filter orders assigned to the specific partner
      });
    } else {
      // If no partnerId is provided, fetch all orders with a status other than "Cancelled", "Rejected", or "Pending"
      orders = await Order.find({
        status: { $nin: ["Cancelled", "Rejected", "Pending"] },
      });
    }

    return res.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ error: 'Error fetching orders' });
  }
};

// restaurantController.js
exports.assignDeliveryPartner = async (req, res) => {
  const { orderId, partnerId } = req.body;
console.log("partnerId"+partnerId)
  try {
    // Find the order by orderId and update its status
    const order = await Order.findOne({ _id: orderId });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update the status to 'Delivery Partner Assigned'
    order.status = 'Delivery Partner Assigned';

    // Set the assignedDeliveryPartner field to the deliveryPartnerId
    order.assignedDeliveryPartner = partnerId;

    await order.save();

    return res.json({ message: `Order ${orderId} assigned to a delivery partner successfully.` });
  } catch (error) {
    console.error(`Error assigning delivery partner to order ${orderId}:`, error);
    return res.status(500).json({ error: 'Error assigning delivery partner' });
  }
};


// controllers/ordersController.js
exports.pickUpOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status === 'Delivery Partner Assigned') {
      // Update the order status to 'Order Picked Up'
      order.status = 'Order Picked Up';

      // Save the order
      await order.save();

      return res.json({ message: `Order ${orderId} has been picked up.` });
    } else {
      return res.status(400).json({ error: 'Invalid order status' });
    }
  } catch (error) {
    console.error(`Error picking up order ${orderId}:`, error);
    return res.status(500).json({ error: 'Error picking up order' });
  }
};

exports.markOrderAsDelivered = async (req, res) => {
  const { orderId } = req.body;

  try {
    const order = await Order.findOne({ _id: orderId });

    if (order && order.status === 'Order Picked Up') {
      // Find the order in the database and update its status to 'Delivered'
      await Order.findOneAndUpdate({ _id: orderId }, { status: 'Delivered' });

      // Update paymentStatus to 'paid'
      await Order.findOneAndUpdate({ _id: orderId }, { paymentStatus: 'paid' });

      // Respond with a success message or updated order
      res.status(200).json({ message: 'Order marked as delivered and payment status updated to "paid" successfully' });
    } else {
      res.status(400).json({ error: 'Order can only be marked as delivered if it is in "Order Picked Up" status' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to mark the order as delivered' });
  }
};


// Controller method for marking an order as 'Not Delivered'
exports.markOrderAsNotDelivered = async (req, res) => {
  const { orderId } = req.body;

  try {
    const order = await Order.findOne({ _id: orderId });

    if (order && order.status === 'Order Picked Up') {
      // Find the order in the database and update its status to 'Not Delivered'
      await Order.findOneAndUpdate({ _id: orderId }, { status: 'Not Delivered' });

      // Update paymentStatus to 'not paid'
      await Order.findOneAndUpdate({ _id: orderId }, { paymentStatus: 'not paid' });

      // Respond with a success message or updated order
      res.status(200).json({ message: 'Order marked as not delivered and payment status updated to "not paid" successfully' });
    } else {
      res.status(400).json({ error: 'Order can only be marked as not delivered if it is in "Order Picked Up" status' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to mark the order as not delivered' });
  }
};

exports.getPartnerOrders = async (req, res) => {
  const { partnerId } = req.body; // Assuming partnerId is passed in the request

  try {
    let orders;
    if (partnerId) {
      // If partnerId is provided, fetch orders assigned to that specific partner
      orders = await Order.find({
        status: { $nin: ["Cancelled", "Rejected", "Pending","Confirmed"] },
        assignedDeliveryPartner: partnerId, // Filter orders assigned to the specific partner
      });
    } else {
      // If no partnerId is provided, fetch all orders with a status other than "Cancelled", "Rejected", or "Pending"
      orders = await Order.find({
        status: { $nin: ["Cancelled", "Rejected", "Pending","Confirmed"] },
      });
    }

    return res.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ error: 'Error fetching orders' });
  }
};

