const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, '../data');
const PROPERTIES_FILE = path.join(DATA_DIR, 'properties.json');
const ADMIN_FILE = path.join(DATA_DIR, 'admin.json');

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

// Initialize on module load
initializeProperties();

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

// Admin user operations
const readAdmin = () => {
  try {
    if (fs.existsSync(ADMIN_FILE)) {
      const data = fs.readFileSync(ADMIN_FILE, 'utf8');
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error('Error reading admin:', error);
    return null;
  }
};

const writeAdmin = (admin) => {
  try {
    fs.writeFileSync(ADMIN_FILE, JSON.stringify(admin, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing admin:', error);
    return false;
  }
};

const getAdminUser = () => {
  return readAdmin();
};

const createAdminUser = (username, hashedPassword) => {
  const admin = {
    id: uuidv4(),
    username,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
  };
  writeAdmin(admin);
  return admin;
};

module.exports = {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getAdminUser,
  createAdminUser,
};
