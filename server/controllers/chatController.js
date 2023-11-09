const ChatMessage = require('../model/chat');
const socketIO = require('../util/socket'); // Socket.IO server instance

exports.getChatMessages = async (req, res) => {
    try {
        // Fetch chat messages from your data source (e.g., a database)
        const messages = await ChatMessage.find(); // Replace with your actual database query
    
        // Return the messages as JSON
        res.json({ messages });
      } catch (error) {
        console.error('Error fetching chat messages:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
};

exports.sendChatMessage = async (req, res) => {
  const { sender, recipient, message } = req.body;
  
  const chatMessage = new ChatMessage({
    sender,
    recipient,
    message,
  });

  try {
    await chatMessage.save();

    // Emit the message to the Socket.IO server, which will forward it to the recipient
    socketIO.getIO().emit('message', chatMessage);

    res.json({ message: chatMessage });
  } catch (error) {
    console.error('Error saving chat message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
