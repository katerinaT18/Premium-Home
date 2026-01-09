import React from 'react';
import Hero from '../components/Hero/Hero';
import PropertyList from '../components/PropertyList/PropertyList';
import CitiesSection from '../components/CitiesSection/CitiesSection';

const HomePage = () => {
  return (
    <>
      <Hero />
      <PropertyList />
      <CitiesSection />
    </>
  );
};

export default HomePage;
