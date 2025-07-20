const Message = require('../models/Message');
const User = require('../models/User'); // Import the User model

// ✅ Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { receiver, content } = req.body;
    const firebaseUID = req.user.uid;

    if (!receiver || !content) {
      return res.status(400).json({ error: 'Receiver and content are required' });
    }

    // 🔍 Find the sender's ObjectId from Firebase UID
    const senderUser = await User.findOne({ firebaseUID });
    if (!senderUser) {
      return res.status(404).json({ error: 'Sender user not found in DB' });
    }

    // ✉️ Create and save the message
    const message = await Message.create({
      sender: senderUser._id,
      receiver, // Must be a valid ObjectId string
      content
    });

    res.status(201).json({
      message: 'Message sent successfully',
      data: message
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message', details: err.message });
  }
};

// ✅ Get messages for the current user
exports.getMessages = async (req, res) => {
  try {
    const firebaseUID = req.user.uid;

    // 🔍 Get the user's ObjectId from Firebase UID
    const user = await User.findOne({ firebaseUID });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 📦 Fetch messages where user is sender or receiver
    const messages = await Message.find({
      $or: [{ sender: user._id }, { receiver: user._id }]
    })
      .sort({ timestamp: -1 })
      .populate('sender', 'email')
      .populate('receiver', 'email');

    res.status(200).json({ messages });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages', details: err.message });
  }
};
