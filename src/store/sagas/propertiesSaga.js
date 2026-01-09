import { call, put, takeLatest } from 'redux-saga/effects';
import {
  fetchPropertiesStart,
  fetchPropertiesSuccess,
  fetchPropertiesFailure,
} from '../slices/propertiesSlice';
import { propertiesAPI } from '../../services/api';

// Fetch properties from API
const fetchPropertiesApi = async () => {
  try {
    const properties = await propertiesAPI.getAll();
    return properties;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch properties');
  }
};

// Worker saga: will be fired on FETCH_PROPERTIES_START actions
function* fetchPropertiesSaga() {
  try {
    // Call the API
    const properties = yield call(fetchPropertiesApi);
    
    // Dispatch success action with properties
    yield put(fetchPropertiesSuccess(properties));
  } catch (error) {
    // Dispatch failure action with error message
    yield put(fetchPropertiesFailure(error.message || 'Failed to fetch properties'));
  }
}

// Watcher saga: spawn a new fetchPropertiesSaga on each FETCH_PROPERTIES_START
export function* watchFetchProperties() {
  // takeLatest: only take the latest request, cancel previous if still running
  yield takeLatest(fetchPropertiesStart.type, fetchPropertiesSaga);
}
