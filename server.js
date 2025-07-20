const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');

dotenv.config();
const app = express();

// ✅ Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1); // Stop the server if DB connection fails
});

// 🔧 Middleware
app.use(cors());
app.use(express.json());

// 📌 Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// 🚀 Default route for testing
app.get('/', (req, res) => {
  res.send('🚀 Server is running!');
});

// 🔊 Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Server running on http://localhost:${PORT}`));
