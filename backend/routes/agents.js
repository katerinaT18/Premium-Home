const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getAllAgents,
  getAgentById,
  createAgent,
  updateAgent,
  deleteAgent,
} = require('../data/database');

// Get all agents (public endpoint)
router.get('/', (req, res) => {
  try {
    const agents = getAllAgents();
    // Always return an array, even if empty
    const agentsArray = Array.isArray(agents) ? agents : [];
    console.log(`Returning ${agentsArray.length} agents`);
    res.status(200).json(agentsArray);
  } catch (error) {
    console.error('Error fetching agents:', error);
    // Return empty array instead of error to prevent frontend issues
    res.status(200).json([]);
  }
});

// Get agent by ID (public endpoint)
router.get('/:id', (req, res) => {
  try {
    const agent = getAgentById(req.params.id);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    res.json(agent);
  } catch (error) {
    console.error('Error fetching agent:', error);
    res.status(500).json({ error: 'Failed to fetch agent' });
  }
});

// Create agent (requires authentication)
router.post('/', authenticateToken, (req, res) => {
  try {
    const agentData = req.body;
    
    // Validate required fields
    if (!agentData.name || !agentData.email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const newAgent = createAgent(agentData);
    res.status(201).json(newAgent);
  } catch (error) {
    console.error('Error creating agent:', error);
    res.status(500).json({ error: 'Failed to create agent' });
  }
});

// Update agent (requires authentication)
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const agent = updateAgent(req.params.id, req.body);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    res.json(agent);
  } catch (error) {
    console.error('Error updating agent:', error);
    res.status(500).json({ error: 'Failed to update agent' });
  }
});

// Delete agent (requires authentication)
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const result = deleteAgent(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    res.json(result);
  } catch (error) {
    console.error('Error deleting agent:', error);
    res.status(500).json({ error: 'Failed to delete agent' });
  }
});

module.exports = router;
