const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} = require('../data/database');

// Get all properties (public)
router.get('/', (req, res) => {
  try {
    const properties = getAllProperties();
    res.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Get single property (public)
router.get('/:id', (req, res) => {
  try {
    const property = getPropertyById(parseInt(req.params.id));
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// Create property (admin only)
router.post('/', authenticateToken, (req, res) => {
  try {
    const propertyData = req.body;
    const newProperty = createProperty(propertyData);
    res.status(201).json(newProperty);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Failed to create property' });
  }
});

// Update property (admin only)
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const propertyData = req.body;
    const updatedProperty = updateProperty(id, propertyData);
    if (!updatedProperty) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(updatedProperty);
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ error: 'Failed to update property' });
  }
});

// Delete property (admin only)
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = deleteProperty(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ error: 'Failed to delete property' });
  }
});

module.exports = router;
