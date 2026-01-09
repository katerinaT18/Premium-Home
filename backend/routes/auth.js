const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { getAdminUser, createAdminUser } = require('../data/database');

// Default admin credentials (change these in production!)
const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'admin123', // Will be hashed on first login
};

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Get or create admin user
    let admin = getAdminUser();
    
    // If no admin exists, create one with default credentials
    if (!admin) {
      const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 10);
      admin = createAdminUser(DEFAULT_ADMIN.username, hashedPassword);
    }

    // Check username
    if (admin.username !== username) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: admin.id,
        username: admin.username,
        role: 'admin' 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: admin.id,
        username: admin.username,
        role: 'admin',
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify token endpoint
router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
