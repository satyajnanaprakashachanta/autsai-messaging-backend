const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');
const syncUserWithFirebase = require('../utils/syncUser');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected route
router.get('/protected', verifyToken, async (req, res) => {
  try {
    const user = await syncUserWithFirebase(req.user);
    res.json({ message: 'You accessed a protected route!', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to sync user' });
  }
});

module.exports = router;
