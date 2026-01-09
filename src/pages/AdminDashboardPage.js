import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';
import {
  deletePropertyStart,
  updatePropertyStart,
  createPropertyStart,
  fetchPropertiesStart,
} from '../store/slices/propertiesSlice';
import { useTranslation } from '../utils/translations';
import { selectAllProperties } from '../store/selectors/propertySelectors';
import PropertyFormModal from '../components/PropertyFormModal/PropertyFormModal';
import './AdminDashboardPage.css';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const properties = useSelector(selectAllProperties);
  const { theme } = useSelector((state) => state.ui);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    } else {
      // Fetch properties when dashboard loads
      dispatch(fetchPropertiesStart());
    }
  }, [isAuthenticated, navigate, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login');
  };

  const handleAddProperty = () => {
    setEditingProperty(null);
    setIsModalOpen(true);
  };

  const handleEditProperty = (property) => {
    setEditingProperty(property);
    setIsModalOpen(true);
  };

  const handleDeleteProperty = (propertyId) => {
    if (window.confirm(t('admin.form.confirmDelete'))) {
      dispatch(deletePropertyStart(propertyId));
    }
  };

  const handleSaveProperty = async (propertyData) => {
    try {
      if (editingProperty) {
        // Update existing property
        dispatch(updatePropertyStart(propertyData));
      } else {
        // Add new property
        dispatch(createPropertyStart(propertyData));
      }
      setIsModalOpen(false);
      setEditingProperty(null);
    } catch (error) {
      console.error('Error saving property:', error);
      alert(t('admin.form.saveError') || 'Failed to save property');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={`admin-dashboard ${theme}`}>
      <div className="admin-header">
        <div className="container">
          <div className="admin-header-content">
            <div>
              <h1>{t('admin.dashboard.welcome')} Admin</h1>
            </div>
            <button onClick={handleLogout} className="logout-button">
              {t('admin.dashboard.logout')}
            </button>
          </div>
        </div>
      </div>

      <div className="admin-content">
        <div className="container">
          <div className="admin-stats">
            <div className="stat-card">
              <h3>{t('admin.dashboard.totalProperties')}</h3>
              <p className="stat-number">{properties.length}</p>
            </div>
            <div className="stat-card">
              <h3>{t('admin.dashboard.activeListings')}</h3>
              <p className="stat-number">{properties.filter(p => !p.featured).length}</p>
            </div>
            <div className="stat-card">
              <h3>{t('admin.dashboard.featuredProperties')}</h3>
              <p className="stat-number">{properties.filter(p => p.featured).length}</p>
            </div>
          </div>

          <div className="admin-section">
            <div className="section-header">
              <h2>{t('admin.dashboard.propertiesManagement')}</h2>
              <button onClick={handleAddProperty} className="add-property-button">
                + {t('admin.dashboard.addProperty')}
              </button>
            </div>
            <div className="properties-table">
              <table>
                <thead>
                  <tr>
                    <th>{t('admin.dashboard.id')}</th>
                    <th>{t('admin.dashboard.location')}</th>
                    <th>{t('admin.dashboard.price')}</th>
                    <th>{t('admin.dashboard.type')}</th>
                    <th>{t('admin.dashboard.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((property) => (
                    <tr key={property.id}>
                      <td>{property.id}</td>
                      <td>{property.location}</td>
                      <td>
                        {property.transactionType === 'rent'
                          ? `${property.price}€/${t('propertyCard.month')}`
                          : `${property.price}€`}
                      </td>
                      <td>{t(`propertyTypes.${property.propertyType}`)}</td>
                      <td>
                        <button
                          className="action-button edit"
                          onClick={() => handleEditProperty(property)}
                        >
                          {t('admin.dashboard.edit')}
                        </button>
                        <button
                          className="action-button delete"
                          onClick={() => handleDeleteProperty(property.id)}
                        >
                          {t('admin.dashboard.delete')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <PropertyFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProperty(null);
        }}
        property={editingProperty}
        onSave={handleSaveProperty}
      />
    </div>
  );
};

export default AdminDashboardPage;
