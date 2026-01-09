const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const propertiesRoutes = require('./routes/properties');
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API root endpoint - provides info about available endpoints
app.get('/api', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Premium Homes API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: {
        login: 'POST /api/auth/login',
        verify: 'GET /api/auth/verify'
      },
      properties: {
        getAll: 'GET /api/properties',
        getById: 'GET /api/properties/:id',
        create: 'POST /api/properties (requires auth)',
        update: 'PUT /api/properties/:id (requires auth)',
        delete: 'DELETE /api/properties/:id (requires auth)'
      },
      upload: {
        single: 'POST /api/upload/image (requires auth)',
        multiple: 'POST /api/upload/images (requires auth)'
      }
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertiesRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Premium Homes API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Premium Homes API server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});
