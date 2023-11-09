// smsUtil.js

const twilio = require('twilio');
require('dotenv').config();

// Your Twilio Account SID and Auth Token
const accountSid = 'ACa9e23a419d5e702889fd7442a44bf4a6';
const authToken = '74ff3dafb0b979235fc2bccb5916a083'

const client = new twilio(accountSid, authToken);

// Function to send SMS
const sendSMS = async (to, message) => {
  try {
    const response = await client.messages.create({
      body: message,
      from: '+16562231656', // Replace with your Twilio phone number
      to,
    });

    return response;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
};

module.exports = sendSMS;
