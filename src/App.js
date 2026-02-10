import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPropertiesStart } from './store/slices/propertiesSlice';
import { checkAuth } from './store/slices/authSlice';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import MapPage from './pages/MapPage';
import AgentsPage from './pages/AgentsPage';
import AgentDetailsPage from './pages/AgentDetailsPage';
import AboutUsPage from './pages/AboutUsPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminRegisterPage from './pages/AdminRegisterPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.ui);

  useEffect(() => {
    // Check authentication on app load (will trigger saga to verify token)
    dispatch(checkAuth());
    // Fetch properties using Redux Saga
    dispatch(fetchPropertiesStart());
  }, [dispatch]);

  useEffect(() => {
    // Apply theme to body
    document.body.className = theme;
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const isAdminPage = window.location.pathname.startsWith('/admin/login') || 
                      window.location.pathname.startsWith('/admin/register');

  return (
    <div className="App">
      {!isAdminPage && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/property/:id" element={<PropertyDetailsPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/agent/:id" element={<AgentDetailsPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/register" element={<AdminRegisterPage />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {!isAdminPage && <Footer />}
    </div>
  );
}

export default App;
