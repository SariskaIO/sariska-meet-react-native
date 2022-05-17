import {applyMiddleware, compose, createStore} from 'redux';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise';
import {rootReducer} from './reducers';
//import AsyncStorage from '@react-native-async-storage/async-storage';

export const store = createStore(
  rootReducer,
  compose(applyMiddleware(promiseMiddleware, thunk)),
);

// global.window.addEventListener('beforeunload', () => {
//   AsyncStorage.setItem('reduxState', JSON.stringify(store.getState().profile));
// });