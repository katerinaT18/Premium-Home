import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedProperty } from '../store/slices/propertiesSlice';
import { selectAllProperties } from '../store/selectors/propertySelectors';
import PropertyDetails from '../components/PropertyDetails/PropertyDetails';

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const properties = useSelector(selectAllProperties);
  const property = properties.find((p) => p.id === parseInt(id));

  useEffect(() => {
    if (property) {
      dispatch(setSelectedProperty(property));
    } else if (properties.length > 0) {
      // Property not found, redirect to home
      navigate('/');
    }
  }, [property, properties, dispatch, navigate]);

  if (!property) {
    return (
      <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <p>Loading property details...</p>
      </div>
    );
  }

  return <PropertyDetails property={property} />;
};

export default PropertyDetailsPage;
