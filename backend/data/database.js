const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, '../data');
const PROPERTIES_FILE = path.join(DATA_DIR, 'properties.json');
const ADMIN_FILE = path.join(DATA_DIR, 'admin.json');
const AGENTS_FILE = path.join(DATA_DIR, 'agents.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize properties file with sample data if it doesn't exist
const initializeProperties = () => {
  if (!fs.existsSync(PROPERTIES_FILE)) {
    const sampleProperties = [
      {
        id: 1,
        title: 'Luxury Apartment in City Center',
        location: 'Tirana, Albania',
        address: 'Blloku, Tirana',
        price: 165000,
        currency: 'EUR',
        area: 88,
        bedrooms: 2,
        bathrooms: 1,
        propertyType: 'apartment',
        transactionType: 'sale',
        agentId: 'agent1',
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
        ],
        description: 'Beautiful modern apartment in the heart of Tirana',
        featured: true,
      },
      {
        id: 2,
        title: 'Modern Villa with Sea View',
        location: 'Vlorë, Albania',
        address: 'Lungomare, Vlorë',
        price: 450,
        currency: 'EUR',
        area: 100,
        bedrooms: 2,
        bathrooms: 2,
        propertyType: 'apartment',
        transactionType: 'rent',
        agentId: 'agent1',
        images: [
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        ],
        description: 'Stunning apartment with panoramic sea views',
        featured: true,
      },
    ];
    fs.writeFileSync(PROPERTIES_FILE, JSON.stringify(sampleProperties, null, 2));
  }
};

// Initialize agents file if it doesn't exist (and seed default agents)
const initializeAgents = () => {
  const defaultAgents = [
    {
      id: 'agent1',
      name: 'Agent1',
      title: 'Real Estate Agent',
      email: 'agent1@premiumhomes.al',
      mobile: '+355 69 000 0001',
      city: 'Tirana',
      image: '/agent1.jpg',
      propertiesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'agent2',
      name: 'Agent2',
      title: 'Real Estate Agent',
      email: 'agent2@premiumhomes.al',
      mobile: '+355 69 000 0002',
      city: 'Tirana',
      image: '/agent2.jpg',
      propertiesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'agent3',
      name: 'Agent3',
      title: 'Real Estate Agent',
      email: 'agent3@premiumhomes.al',
      mobile: '+355 69 000 0003',
      city: 'Tirana',
      image: '/agent3.jpg',
      propertiesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'agent4',
      name: 'Agent4',
      title: 'Real Estate Agent',
      email: 'agent4@premiumhomes.al',
      mobile: '+355 69 000 0004',
      city: 'Tirana',
      image: '/agent4.jpg',
      propertiesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  if (!fs.existsSync(AGENTS_FILE)) {
    // No agents file yet – seed with 4 default agents
    fs.writeFileSync(AGENTS_FILE, JSON.stringify(defaultAgents, null, 2));
    return;
  }

  try {
    const data = fs.readFileSync(AGENTS_FILE, 'utf8');
    const parsed = JSON.parse(data || '[]');
    // If file exists but is empty array, also seed defaults
    if (Array.isArray(parsed) && parsed.length === 0) {
      fs.writeFileSync(AGENTS_FILE, JSON.stringify(defaultAgents, null, 2));
    }
  } catch (error) {
    console.error('Error initializing agents file, seeding defaults:', error);
    fs.writeFileSync(AGENTS_FILE, JSON.stringify(defaultAgents, null, 2));
  }
};

// Initialize on module load
initializeProperties();
initializeAgents();

// Properties CRUD operations
const readProperties = () => {
  try {
    const data = fs.readFileSync(PROPERTIES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading properties:', error);
    return [];
  }
};

const writeProperties = (properties) => {
  try {
    fs.writeFileSync(PROPERTIES_FILE, JSON.stringify(properties, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing properties:', error);
    return false;
  }
};

const getAllProperties = () => {
  return readProperties();
};

const getPropertyById = (id) => {
  const properties = readProperties();
  return properties.find(p => p.id === id);
};

const createProperty = (propertyData) => {
  const properties = readProperties();
  const newProperty = {
    ...propertyData,
    id: propertyData.id || Math.max(...properties.map(p => p.id || 0), 0) + 1,
  };
  properties.push(newProperty);
  writeProperties(properties);
  return newProperty;
};

const updateProperty = (id, propertyData) => {
  const properties = readProperties();
  const index = properties.findIndex(p => p.id === id);
  if (index === -1) {
    return null;
  }
  properties[index] = { ...propertyData, id };
  writeProperties(properties);
  return properties[index];
};

const deleteProperty = (id) => {
  const properties = readProperties();
  const filtered = properties.filter(p => p.id !== id);
  if (filtered.length === properties.length) {
    return null; // Property not found
  }
  writeProperties(filtered);
  return { success: true };
};

// Admin user operations - now supports multiple admins
const readAdmins = () => {
  try {
    if (fs.existsSync(ADMIN_FILE)) {
      const data = fs.readFileSync(ADMIN_FILE, 'utf8');
      const parsed = JSON.parse(data);
      // Handle migration: if it's a single object, convert to array
      if (parsed && !Array.isArray(parsed)) {
        return [parsed];
      }
      return parsed || [];
    }
    return [];
  } catch (error) {
    console.error('Error reading admins:', error);
    return [];
  }
};

const writeAdmins = (admins) => {
  try {
    fs.writeFileSync(ADMIN_FILE, JSON.stringify(admins, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing admins:', error);
    return false;
  }
};

// Get all admins
const getAllAdmins = () => {
  return readAdmins();
};

// Get admin by username
const getAdminByUsername = (username) => {
  const admins = readAdmins();
  return admins.find(a => a.username === username);
};

// Get admin by ID
const getAdminById = (id) => {
  const admins = readAdmins();
  return admins.find(a => a.id === id);
};

// Legacy function for backward compatibility
const getAdminUser = () => {
  const admins = readAdmins();
  return admins.length > 0 ? admins[0] : null;
};

const createAdminUser = (username, hashedPassword) => {
  const admins = readAdmins();
  
  // Check if username already exists
  if (admins.some(a => a.username === username)) {
    throw new Error('Username already exists');
  }
  
  const admin = {
    id: uuidv4(),
    username,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
  };
  admins.push(admin);
  writeAdmins(admins);
  return admin;
};

// Agents CRUD operations
const readAgents = () => {
  try {
    if (fs.existsSync(AGENTS_FILE)) {
      const data = fs.readFileSync(AGENTS_FILE, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error reading agents:', error);
    return [];
  }
};

const writeAgents = (agents) => {
  try {
    fs.writeFileSync(AGENTS_FILE, JSON.stringify(agents, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing agents:', error);
    return false;
  }
};

const getAllAgents = () => {
  return readAgents();
};

const getAgentById = (id) => {
  const agents = readAgents();
  return agents.find(a => a.id === id);
};

const getAgentByAdminId = (adminId) => {
  const agents = readAgents();
  return agents.find(a => a.adminId === adminId);
};

const createAgent = (agentData) => {
  const agents = readAgents();
  const newAgent = {
    ...agentData,
    id: agentData.id || uuidv4(),
    createdAt: agentData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  agents.push(newAgent);
  writeAgents(agents);
  return newAgent;
};

const updateAgent = (id, agentData) => {
  const agents = readAgents();
  const index = agents.findIndex(a => a.id === id);
  if (index === -1) {
    return null;
  }
  agents[index] = { 
    ...agents[index],
    ...agentData,
    id,
    updatedAt: new Date().toISOString(),
  };
  writeAgents(agents);
  return agents[index];
};

const deleteAgent = (id) => {
  const agents = readAgents();
  const filtered = agents.filter(a => a.id !== id);
  if (filtered.length === agents.length) {
    return null; // Agent not found
  }
  writeAgents(filtered);
  return { success: true };
};

module.exports = {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getAllAdmins,
  getAdminUser, // Legacy function for backward compatibility
  getAdminByUsername,
  getAdminById,
  createAdminUser,
  getAllAgents,
  getAgentById,
  getAgentByAdminId,
  createAgent,
  updateAgent,
  deleteAgent,
};
