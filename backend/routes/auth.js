const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { getAdminUser, getAdminByUsername, createAdminUser, getAgentByAdminId, createAgent } = require('../data/database');

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

    // Find admin by username
    let admin = getAdminByUsername(username);
    
    // If no admin exists and trying to login with default credentials, create one
    if (!admin && username === DEFAULT_ADMIN.username) {
      const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 10);
      admin = createAdminUser(DEFAULT_ADMIN.username, hashedPassword);
      
      // Create agent profile for the admin
      const existingAgent = getAgentByAdminId(admin.id);
      if (!existingAgent) {
        createAgent({
          adminId: admin.id,
          name: admin.username,
          title: 'Agent',
          email: `${admin.username}@premiumhomes.al`,
          mobile: '',
          city: 'Tirana',
          image: '/agent1.jpg',
          propertiesCount: 0,
        });
      }
    }

    // Check if admin exists
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Ensure agent profile exists for this admin
    let agent = getAgentByAdminId(admin.id);
    if (!agent) {
      agent = createAgent({
        adminId: admin.id,
        name: admin.username,
        title: 'Agent',
        email: `${admin.username}@premiumhomes.al`,
        mobile: '',
        city: 'Tirana',
        image: '/agent1.jpg',
        propertiesCount: 0,
      });
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || 'premium-homes-secret-key-change-in-production';
    const token = jwt.sign(
      { 
        id: admin.id,
        username: admin.username,
        role: 'admin',
        agentId: agent ? agent.id : undefined,
      },
      jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: admin.id,
        username: admin.username,
        role: 'admin',
        agentId: agent ? agent.id : null,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Register endpoint - creates admin account and agent profile
router.post('/register', async (req, res) => {
  try {
    const { username, password, name, email, mobile, city, title } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if admin already exists
    const existingAdmin = getAdminByUsername(username);
    if (existingAdmin) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash(password, 10);
    let admin;
    try {
      admin = createAdminUser(username, hashedPassword);
    } catch (error) {
      if (error.message === 'Username already exists') {
        return res.status(400).json({ error: 'Username already exists' });
      }
      throw error;
    }

    // Create agent profile
    const agent = createAgent({
      adminId: admin.id,
      name: name || username,
      title: title || 'Agent',
      email: email || `${username}@premiumhomes.al`,
      mobile: mobile || '',
      city: city || 'Tirana',
      image: '/agent1.jpg',
      propertiesCount: 0,
    });

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || 'premium-homes-secret-key-change-in-production';
    const token = jwt.sign(
      { 
        id: admin.id,
        username: admin.username,
        role: 'admin',
        agentId: agent.id,
      },
      jwtSecret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: admin.id,
        username: admin.username,
        role: 'admin',
        agentId: agent.id,
      },
      agent,
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.message) {
      return res.status(400).json({ error: error.message });
    }
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
    const jwtSecret = process.env.JWT_SECRET || 'premium-homes-secret-key-change-in-production';
    const decoded = jwt.verify(token, jwtSecret);
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
