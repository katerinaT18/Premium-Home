import { call, put, takeEvery } from 'redux-saga/effects';
import { checkAuth, setAuthVerified, loginStart, loginSuccess, loginFailure } from '../slices/authSlice';
import { authAPI } from '../../services/api';

// Login saga
function* loginSaga(action) {
  try {
    const { username, password } = action.payload;
    const response = yield call(authAPI.login, username, password);
    
    yield put(loginSuccess({
      username: response.user.username,
      role: response.user.role,
      loginTime: new Date().toISOString(),
      token: response.token,
    }));
  } catch (error) {
    let errorMessage = 'Failed to login';
    
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      errorMessage = 'Cannot connect to server. Please make sure the backend is running on http://localhost:5000';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    yield put(loginFailure(errorMessage));
  }
}

// Verify auth token saga
function* verifyAuthSaga() {
  try {
    const storedAuth = localStorage.getItem('adminAuth');
    if (storedAuth) {
      const authData = JSON.parse(storedAuth);
      if (authData.token) {
        yield call(authAPI.verify);
        yield put(setAuthVerified(true));
      } else {
        yield put(setAuthVerified(false));
      }
    } else {
      yield put(setAuthVerified(false));
    }
  } catch (error) {
    // Token invalid
    yield put(setAuthVerified(false));
  }
}

export function* watchLogin() {
  yield takeEvery(loginStart.type, loginSaga);
}

export function* watchCheckAuth() {
  yield takeEvery(checkAuth.type, verifyAuthSaga);
}
