import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers';
import { createLogger } from 'redux-logger';

const middlewares = [thunkMiddleware];

const hasReduxDevToolsInstalled = !!(
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
);

const composeEnhancers = hasReduxDevToolsInstalled
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  : compose;

if (!hasReduxDevToolsInstalled && process.env.NODE_ENV === 'development') {
  middlewares.push(createLogger());
}

export default function configureStore (initialState) {
  return createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middlewares))
  );
}
