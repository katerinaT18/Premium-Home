import { all } from 'redux-saga/effects';
import { watchFetchProperties } from './propertiesSaga';
import {
  watchCreateProperty,
  watchUpdateProperty,
  watchDeleteProperty,
} from './propertyActionsSaga';
import { watchLogin, watchCheckAuth } from './authSaga';

// Root saga that combines all sagas
export default function* rootSaga() {
  yield all([
    watchFetchProperties(),
    watchCreateProperty(),
    watchUpdateProperty(),
    watchDeleteProperty(),
    watchLogin(),
    watchCheckAuth(),
  ]);
}
