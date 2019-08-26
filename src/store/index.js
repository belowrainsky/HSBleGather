import { createStore, combineReducers } from 'redux';
import bleReducer from '../reducers/bleReducer';

const rootReducer = combineReducers({
  bles: bleReducer,
});

const store = createStore(rootReducer);

export default store;

