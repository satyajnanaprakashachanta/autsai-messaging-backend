const admin = require('firebase-admin');
const User = require('../models/User');
const { auth } = require('../firebase/firebaseConfig'); // still used for register

// Register with Firebase Admin SDK
const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRecord = await auth.createUser({ email, password });
    res.status(201).json({ message: 'User registered', uid: userRecord.uid });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Login using Firebase ID Token (sent from frontend)
const login = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const { uid, email, name } = decoded;

    // Check if user exists in MongoDB
    let user = await User.findOne({ firebaseUID: uid });

    // If not, create it
    if (!user) {
      user = await User.create({
        firebaseUID: uid,
        email,
        name: name || email.split('@')[0],
      });
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { register, login };
