import { call, put, takeEvery } from 'redux-saga/effects';
import {
  addProperty,
  updateProperty as updatePropertyAction,
  deleteProperty as deletePropertyAction,
  fetchPropertiesStart,
  createPropertyStart,
  updatePropertyStart,
  deletePropertyStart,
} from '../slices/propertiesSlice';
import { propertiesAPI } from '../../services/api';

// Create property saga
function* createPropertySaga(action) {
  try {
    const newProperty = yield call(propertiesAPI.create, action.payload);
    // Refresh properties list to get updated data
    yield put(fetchPropertiesStart());
    // Also update UI immediately
    yield put(addProperty(newProperty));
  } catch (error) {
    console.error('Error creating property:', error);
    alert('Failed to create property: ' + error.message);
  }
}

// Update property saga
function* updatePropertySaga(action) {
  try {
    const { id, ...propertyData } = action.payload;
    const updatedProperty = yield call(propertiesAPI.update, id, { ...propertyData, id });
    // Refresh properties list to get updated data
    yield put(fetchPropertiesStart());
    // Also update UI immediately
    yield put(updatePropertyAction(updatedProperty));
  } catch (error) {
    console.error('Error updating property:', error);
    alert('Failed to update property: ' + error.message);
  }
}

// Delete property saga
function* deletePropertySaga(action) {
  try {
    yield call(propertiesAPI.delete, action.payload);
    // Refresh properties list to get updated data
    yield put(fetchPropertiesStart());
    // Also update UI immediately
    yield put(deletePropertyAction(action.payload));
  } catch (error) {
    console.error('Error deleting property:', error);
    alert('Failed to delete property: ' + error.message);
  }
}

// Watchers
export function* watchCreateProperty() {
  yield takeEvery(createPropertyStart.type, createPropertySaga);
}

export function* watchUpdateProperty() {
  yield takeEvery(updatePropertyStart.type, updatePropertySaga);
}

export function* watchDeleteProperty() {
  yield takeEvery(deletePropertyStart.type, deletePropertySaga);
}
