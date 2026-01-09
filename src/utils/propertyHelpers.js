export const formatPrice = (price, currency = 'EUR') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const filterProperties = (properties, filters) => {
  return properties.filter((property) => {
    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesSearch =
        property.title.toLowerCase().includes(query) ||
        property.location.toLowerCase().includes(query) ||
        property.address.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Property type filter
    if (filters.propertyType !== 'all' && property.propertyType !== filters.propertyType) {
      return false;
    }

    // Transaction type filter
    if (filters.transactionType !== 'all' && property.transactionType !== filters.transactionType) {
      return false;
    }

    // City filter
    if (filters.city !== 'all') {
      const propertyCity = property.location.split(',')[0].trim();
      if (propertyCity.toLowerCase() !== filters.city.toLowerCase()) {
        return false;
      }
    }

    // Price filters
    if (filters.minPrice && property.price < parseFloat(filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice && property.price > parseFloat(filters.maxPrice)) {
      return false;
    }

    // Bedrooms filter
    if (filters.bedrooms !== 'all') {
      const bedrooms = parseInt(filters.bedrooms);
      if (property.bedrooms !== bedrooms) {
        return false;
      }
    }

    // Apartment type filter (only applies when property type is apartment)
    if (filters.propertyType === 'apartment' && filters.apartmentType !== 'all') {
      const apartmentTypeBedrooms = parseInt(filters.apartmentType.split('+')[0]);
      if (property.bedrooms !== apartmentTypeBedrooms) {
        return false;
      }
    }

    return true;
  });
};

export const sortProperties = (properties, sortBy) => {
  const sorted = [...properties];
  
  switch (sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'newest':
    default:
      return sorted.sort((a, b) => b.id - a.id);
  }
};
