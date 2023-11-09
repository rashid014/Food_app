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

    //   fetchChatMessages();
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
  }, [socket, messages]);

//   const fetchChatMessages = () => {
//     // Replace 'your_api_endpoint' with the actual API endpoint to fetch chat messages.
//     axios.get('/api/chat-messages') // Replace with your actual API endpoint
//       .then((response) => {
//         setMessages(response.data.messages);
//       })
//       .catch((error) => {
//         console.error('Error fetching chat messages:', error);
//       });
//   };
  const fetchAssignedDeliveryPartner = () => {
    // Assuming deliveryPartnerId is the ID of the assigned delivery partner for the current order
    const deliveryPartnerId = orders.assignedDeliveryPartner; // Get it from the current order
    setDeliveryPartnerId(deliveryPartnerId);
  };
  
  const fetchUserInformation = () => {
    // Assuming userId is the ID of the user who placed the current order
    const userId = orders.user; // Get it from the current order
    setUserId(userId);
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
          subtitle="Hello! How can I assist you?"
        />
      )}
      {isTyping && <div>Bot is typing...</div>}
    </div>
  );
}

export default MyChatBot;
