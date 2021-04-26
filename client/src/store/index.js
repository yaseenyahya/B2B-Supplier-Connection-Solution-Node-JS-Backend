import { createStore, applyMiddleware,compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middleWare = applyMiddleware(thunk);
const Store = createStore(rootReducer, composeEnhancers(middleWare));

export default Store;
