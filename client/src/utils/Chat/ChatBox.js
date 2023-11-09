import React, { useState, useEffect } from 'react';
import { Widget, addResponseMessage, addUserMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import './ChatBox.css';
import axios from 'axios';
import io from 'socket.io-client';

function MyChatBot() {
  const [isTyping, setIsTyping] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [deliveryPartnerId, setDeliveryPartnerId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [socket, setSocket] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const ordersResponse = await axios.get('http://localhost:4000/api/partnerpayment');
        setOrders(ordersResponse.data.orders);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (isChatOpen) {
      // Connect to the Socket.IO server
      const newSocket = io.connect('http://localhost:4000'); // Replace with your Socket.IO server URL
      setSocket(newSocket);

      fetchAssignedDeliveryPartner();
      // Fetch user information during chat initiation, e.g., after successful login.
      fetchUserInformation();
    }
  }, [isChatOpen]);

  useEffect(() => {
    if (socket) {
      socket.on('message', (message) => {
        // Handle incoming messages from the server and add them to the chat
        setMessages([...messages, message]);
        setIsTyping(false);
      });
    }
  }, [socket]);

  const fetchAssignedDeliveryPartner = () => {
    const newDeliveryPartnerId = orders.assignedDeliveryPartner;
    setDeliveryPartnerId(newDeliveryPartnerId);

    // Clear the chat history for a new order
    setMessages([]);
    setIsTyping(false);
  };

  const fetchUserInformation = () => {
    const newUserId = orders.user;
    setUserId(newUserId);

    // Clear the chat history for a new order
    setMessages([]);
    setIsTyping(false);
  };

  const handleNewUserMessage = (newMessage) => {
    setIsTyping(true);
    addUserMessage(newMessage);

    if (socket) {
      if (orders.assignedDeliveryPartner === deliveryPartnerId && orders.user === userId) {
        socket.emit('message', {
          message: newMessage,
          sender: deliveryPartnerId,
          recipient: userId,
        });
      } else {
        console.error('Delivery partner and user are not from the same order.');
      }
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div>
      <button onClick={toggleChat}>Open Chat</button>
      {isChatOpen && (
        <Widget
          handleNewUserMessage={handleNewUserMessage}
          title="ChatBot"
          subtitle=""
        />
      )}
      {isTyping && <div>Bot is typing...</div>}
      {messages.map((message, index) => (
        <div key={index}>{message.text}</div>
      ))}
    </div>
  );
}

export default MyChatBot;
