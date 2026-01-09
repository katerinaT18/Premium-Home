import { createSelector } from '@reduxjs/toolkit';
import { filterProperties, sortProperties } from '../../utils/propertyHelpers';

// Base selectors
export const selectAllProperties = (state) => state.properties.properties;
export const selectPropertiesLoading = (state) => state.properties.loading;
export const selectPropertiesError = (state) => state.properties.error;
export const selectSelectedProperty = (state) => state.properties.selectedProperty;
export const selectFilters = (state) => state.filters;

// Memoized selector for filtered and sorted properties
export const selectFilteredProperties = createSelector(
  [selectAllProperties, selectFilters],
  (properties, filters) => {
    const filtered = filterProperties(properties, filters);
    return sortProperties(filtered, filters.sortBy);
  }
);

// Selector for featured properties
export const selectFeaturedProperties = createSelector(
  [selectAllProperties],
  (properties) => properties.filter((property) => property.featured)
);

// Selector for properties by type
export const selectPropertiesByType = createSelector(
  [selectAllProperties, (state, propertyType) => propertyType],
  (properties, propertyType) => {
    if (propertyType === 'all') return properties;
    return properties.filter((p) => p.propertyType === propertyType);
  }
);

// Selector for properties by transaction type
export const selectPropertiesByTransaction = createSelector(
  [selectAllProperties, (state, transactionType) => transactionType],
  (properties, transactionType) => {
    if (transactionType === 'all') return properties;
    return properties.filter((p) => p.transactionType === transactionType);
  }
);

// Selector for property count
export const selectPropertyCount = createSelector(
  [selectFilteredProperties],
  (properties) => properties.length
);
