// utils/syncUser.js
const User = require('../models/User');

const syncUserWithFirebase = async (decodedToken) => {
  const { uid, email, name } = decodedToken;

  let user = await User.findOne({ firebaseUID: uid });

  if (!user) {
    user = new User({
      firebaseUID: uid,
      email,
      name: name || '', // fallback if name not provided
    });

    await user.save();
  }

  return user;
};

module.exports = syncUserWithFirebase;
