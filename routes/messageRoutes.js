const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const { sendMessage, getMessages } = require('../controllers/messageController');

// Debug log
console.log('✅ messageRoutes loaded');

// POST /api/messages → send a message
router.post('/', verifyToken, sendMessage);

// GET /api/messages → fetch messages for the user
router.get('/', verifyToken, getMessages);

module.exports = router;
