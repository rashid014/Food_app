// smsUtil.js

const twilio = require('twilio');

// Your Twilio Account SID and Auth Token
const accountSid = 'AC336f2ef350082f102b91a07ecaa8dcbc';
const authToken = '8f9891a1ffccda091b17102d63331194';

const client = new twilio(accountSid, authToken);

// Function to send SMS
const sendSMS = async (to, message) => {
  try {
    const response = await client.messages.create({
      body: message,
      from: '+12295979170', // Replace with your Twilio phone number
      to,
    });

    return response;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
};

module.exports = sendSMS;
