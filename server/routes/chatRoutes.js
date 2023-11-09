// routes/couponRoutes.js
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const partnerController=require('../controllers/partnerController')

router.get('/chat-messages', chatController.getChatMessages);
router.get('/send-chat-message', chatController.sendChatMessage);
router.get('/partnerpayment', partnerController.getPartnerOrders);


module.exports = router;
